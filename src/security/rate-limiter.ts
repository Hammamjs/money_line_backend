import { rateLimit } from 'express-rate-limit';

export const rateLimiter = (limit = 3) =>
  rateLimit({
    windowMs: 15 * 60 * 1000, // block user for 15min
    message: 'Too many request try after some time',
    limit: limit,
  });
