import 'dotenv/config';
import { usersRepository } from '../repository/users.repository.js';
import { Errors } from '../errors/map.errors.js';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { genTokens } from '../utils/generate.tokens.js';
import { sanitizeUser } from '../utils/sanitize.user.js';
import { randomInt, createHash } from 'crypto';
import redisClient from '../config/redis.js';
import { sendEmail } from '../utils/send.email.js';
import { authRepository } from '../repository/auth.repostiory.js';

export const authService = {
  singIn: async ({ email, password }) => {
    const user = await usersRepository.getByEmail(email);
    if (!user) throw Errors.notFound('Incorrect email or password');

    const isMatched = await compare(password, user.password);

    if (!isMatched) throw Errors.unauthorized('Incorrect email or password');

    const { accessToken, refreshToken } = genTokens({
      email,
      role: user.role,
      id: user.id,
    });

    const updatedRefreshToken = await authRepository.updateRefreshToken(
      user.id,
      {
        refreshToken: await hash(refreshToken, Number(process.env.HASH_SALT)),
      },
    );

    if (!updatedRefreshToken)
      throw Errors.internal('Failed to update database');

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };
  },

  signup: async ({ email, username, phone, password }) => {
    if (!email || !password) throw Errors.badRequest('Missing required fields');

    const userResult = await usersRepository.getByEmail(email);

    if (userResult) throw Errors.conflict('Email already exists');

    const hashedPassword = await hash(
      password,
      Number(process.env.HASH_SALT) || 12,
    );

    const user = await usersRepository.create({
      email,
      password: hashedPassword,
      phone,
      username,
    });

    const { accessToken, refreshToken } = genTokens({
      email,
      role: user.role,
      id: user.id,
    });

    await usersRepository.update(user.id, {
      refreshToken: await hash(
        refreshToken,
        Number(process.env.HASH_SALT) || 12,
      ),
    });

    return {
      user: sanitizeUser(user),
      refreshToken,
      accessToken,
    };
  },

  forgetPassword: async ({ email }) => {
    if (!email) throw Errors.badRequest('Email is requred');

    const user = await usersRepository.getByEmail(email);

    if (!user) throw Errors.notFound('user not found');

    const resetCode = randomInt(100000, 1000000);

    const hashedCode = createHash('sha256')
      .update(String(resetCode))
      .digest('hex');

    const hashKey = `reset-password:${user.id}`;

    // we should delete the old code if exist
    await redisClient.del(hashKey);

    await redisClient.set(hashKey, hashedCode, {
      EX: 600,
    });

    // send email to user
    await sendEmail(user, resetCode);

    return { message: 'Rest code sent to your email' };
  },

  verifyResetCode: async ({ email, resetCode }) => {
    if (!email || !resetCode)
      throw Errors.badRequest('Missing required fields');

    const user = await usersRepository.getByEmail(email);

    if (!user) throw Errors.notFound('User not exists');

    const hashedKey = `reset-password:${user.id}`;

    const storedCode = await redisClient.get(hashedKey);

    if (!storedCode)
      throw Errors.badRequest('Reset password code not found or expired');

    const hashedCode = createHash('sha256')
      .update(String(resetCode))
      .digest('hex');

    if (hashedCode !== storedCode)
      throw Errors.badRequest('Incorrect reset code');

    await redisClient.del(hashedKey);

    await redisClient.set(`reset-verified:${user.id}`, 'true', {
      EX: 600, // 10 minutes
    });

    return {
      message: 'Reset your password',
    };
  },

  resetPassword: async ({ password, email }) => {
    if (!password || !email) throw Errors.badRequest('Missing required fields');

    const user = await usersRepository.getByEmail(email);

    if (!user) throw Errors.notFound('User not found');

    const hashedKey = `reset-verified:${user.id}`;

    const isVerified = await redisClient.get(hashedKey);

    if (!isVerified) throw Errors.unauthorized('Reset code not verified');

    const hashedNewPassword = await hash(
      password,
      Number(process.env.HASH_SALT) || 12,
    );

    const updatedUser = await authRepository.updatePassword(user.id, {
      password: hashedNewPassword,
    });

    if (!updatedUser) throw Errors.internal('Password update failed');

    await redisClient.del(hashedKey);

    return {
      message: 'Password updated successfully',
    };
  },
};
