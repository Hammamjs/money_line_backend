import { Errors } from '@/src/errors/map-errors.js';
import { authRepository } from '@/src/repository/auth.repository.js';
import { usersRepository } from '@/src/repository/users.repository.js';
import type {
  JWTPaylaods,
  LogoutInput,
  SignInInput,
  SignUpInput,
} from '@/src/types/auth.js';
import type { Roles } from '@/src/types/users.js';
import { auditAuth, AuditEvent } from '@/src/logging/auth-audit.js';
import { genTokens } from '@/src/utils/generate-tokens.js';
import { hashToken } from '@/src/utils/hash-token.js';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

export const credentialsService = {
  authSignIn: async ({ email, password }: SignInInput) => {
    const user = await usersRepository.getByEmail(email);
    if (!user) {
      auditAuth(AuditEvent.SIGNIN_FAILED_NO_USER, { email });
      throw Errors.notFound('Incorrect email or password');
    }

    if (!user.password) {
      auditAuth(AuditEvent.SIGNIN_FAILED_NO_PASS, { userId: user.id, email });
      throw Errors.notFound(
        'This account does not have a password. Please set a password first.',
      );
    }

    const isMatched = await compare(password, user.password);

    if (!isMatched) {
      auditAuth(AuditEvent.SIGNIN_FAILED_BAD_PASS, { userId: user.id, email });
      throw Errors.unauthorized('Incorrect email or password');
    }

    const { accessToken, refreshToken } = genTokens({
      email,
      role: user.role,
      userId: user.id,
    });

    const newHashedRefreshToken = hashToken(refreshToken);

    const refreshTokenArray = [
      ...(user.refreshToken ?? []),
      newHashedRefreshToken,
    ];

    const updatedRefreshToken = await authRepository.updateRefreshToken(
      user.id,
      {
        refreshToken: refreshTokenArray,
      },
    );

    if (!updatedRefreshToken) {
      auditAuth(AuditEvent.DB_UPDATE_ERROR, { userId: user.id });
      throw Errors.internal('Failed to update database');
    }

    auditAuth(AuditEvent.SIGNIN_SUCCESS, { userId: user.id, email });

    return {
      user,
      accessToken,
      refreshToken,
    };
  },

  authSignup: async ({ email, username, password }: SignUpInput) => {
    if (!email || !password) throw Errors.badRequest('Missing required fields');

    const userResult = await usersRepository.getByEmail(email);

    if (userResult) {
      auditAuth(AuditEvent.SIGNUP_CONFLICT, { userId: userResult.id, email });
      throw Errors.conflict('Email already exists');
    }

    const hashedPassword = await hash(
      password,
      Number(process.env.HASH_SALT) || 12,
    );

    const user = await usersRepository.create({
      email,
      password: hashedPassword,
      username,
    });

    if (!user) {
      auditAuth(AuditEvent.DB_UPDATE_ERROR, { email });
      throw Errors.internal('Failed to create user');
    }

    const { accessToken, refreshToken } = genTokens({
      email,
      role: user.role,
      userId: user.id,
    });

    const hashedRefreshToken = hashToken(refreshToken);

    await authRepository.updateRefreshToken(user.id, {
      refreshToken: [hashedRefreshToken],
    });

    auditAuth(AuditEvent.SIGNUP_SUCCESS, { userId: user.id });

    return {
      user,
      refreshToken,
      accessToken,
    };
  },

  handleRefreshToken: async ({ refreshToken }: { refreshToken: string }) => {
    if (!refreshToken) throw Errors.badRequest('Refresh token is required');

    const incomingToken = hashToken(refreshToken);

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET!,
    ) as { role: Roles; email: string; userId: string };

    const userFound = await usersRepository.getById(decoded.userId);

    if (!userFound) {
      const hackedUser = await usersRepository.getByEmail(decoded.email);
      if (hackedUser)
        await authRepository.updateRefreshToken(hackedUser.id, {
          refreshToken: [],
        });

      auditAuth(AuditEvent.TOKEN_REUSE_DETECTED, {
        email: decoded.email,
        userId: decoded.userId,
      });

      throw Errors.forbidden('Invalid refresh token');
    }

    const hasValidToken = userFound.refreshToken?.includes(incomingToken);

    if (!hasValidToken) {
      await authRepository.updateRefreshToken(decoded.userId, {
        refreshToken: [],
      });
      throw Errors.forbidden('Invalid refresh token');
    }

    const { accessToken, refreshToken: newRefreshToken } = genTokens({
      email: userFound.email,
      userId: userFound.id,
      role: userFound.role,
    });

    const oldRefreshTokens = userFound.refreshToken?.filter(
      (rt) => rt !== incomingToken,
    );

    const newHashedRefreshToken = hashToken(newRefreshToken);

    await authRepository.updateRefreshToken(userFound.id, {
      refreshToken: [...(oldRefreshTokens ?? []), newHashedRefreshToken],
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
      user: userFound,
    };
  },

  logOut: async ({ refreshToken, user }: LogoutInput) => {
    if (!refreshToken) throw Errors.badRequest('refresh token not found');

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET!,
    ) as JWTPaylaods;

    if (!decoded) {
      const hackedUser = await usersRepository.getByEmail(user.email);

      if (hackedUser)
        await authRepository.updateRefreshToken(hackedUser.id, {
          refreshToken: [],
        });

      throw Errors.unauthorized('Invalid refresh token');
    }

    const userFound = await usersRepository.getById(decoded.id);

    if (!userFound) throw Errors.notFound('User not found');

    const hashedRefreshToken = hashToken(refreshToken);

    const refreshTokenArray =
      userFound.refreshToken?.filter((ht) => ht !== hashedRefreshToken) ?? [];

    await authRepository.updateRefreshToken(decoded.id, {
      refreshToken: [...refreshTokenArray],
    });

    return;
  },

  processGoogleService: async (userPayload: {
    email: string;
    id: string;
    role: Roles;
  }) => {
    const userId = userPayload.id;

    if (!userId) {
      auditAuth(AuditEvent.SIGNIN_FAILED_NO_USER, { userId });
      throw Errors.notFound('User ID is missing from OAuth payload');
    }

    const { accessToken, refreshToken } = genTokens({
      userId: userPayload.id,
      email: userPayload.email,
      role: userPayload.role,
    });

    const user = await usersRepository.getById(userPayload.id);

    if (!user) {
      auditAuth(AuditEvent.SIGNIN_FAILED_NO_USER, {
        userId: userPayload.id,
        email: userPayload.email,
      });
      throw Errors.notFound('User not found');
    }

    const hashedRefreshToken = hashToken(refreshToken);

    await authRepository.updateRefreshToken(userPayload.id, {
      refreshToken: [hashedRefreshToken],
    });

    auditAuth(AuditEvent.OAUTH_GOOGLE_SUCCESS, {
      userId: user.id,
      email: user.email,
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  },
};
