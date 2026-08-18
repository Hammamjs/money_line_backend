import 'dotenv/config';
import type { Response } from 'express';

const isProd = process.env.NODE_ENV === 'production';

export const setCookie = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

export const removeCookie = (res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: isProd ? 'none' : 'lax',
    secure: isProd,
    path: '/',
  });
};
