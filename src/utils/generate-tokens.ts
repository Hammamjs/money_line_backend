import 'dotenv/config';
import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Roles } from '../types/users.js';

const {
  JWT_ACCESS_TOKEN_EXPIRESIN,
  JWT_REFRESH_TOKEN_EXPIRESIN,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_SECRET,
} = process.env;

if (
  !JWT_ACCESS_TOKEN_SECRET ||
  !JWT_REFRESH_TOKEN_SECRET ||
  !JWT_ACCESS_TOKEN_EXPIRESIN ||
  !JWT_REFRESH_TOKEN_EXPIRESIN
) {
  throw new Error('JWT environment variables are missing');
}

type genTokens = { email: string; role: Roles; userId: string };

export const genTokens = ({ email, role, userId }: genTokens) => {
  const accessToken = jwt.sign(
    { email, role: role, userId },
    JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: JWT_ACCESS_TOKEN_EXPIRESIN,
    } as SignOptions,
  );

  const refreshToken = jwt.sign(
    { email, role: role, userId },
    JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: JWT_REFRESH_TOKEN_EXPIRESIN,
    } as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};
