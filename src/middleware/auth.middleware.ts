import 'dotenv/config';
import { Errors } from '../errors/map-errors.js';
import jwt from 'jsonwebtoken';
import { usersService } from '../services/users.service.js';
import type { NextFunction, Response, Request } from 'express';
import { usersRepository } from '../repository/users.repository.js';

const { JsonWebTokenError, TokenExpiredError } = jwt;

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return next(Errors.unauthorized('Authentication required'));

    const token = authHeader.split(' ')[1];

    if (!token) return next(new Error('Token is missing'));

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };

    const user = await usersRepository.getById(decoded.userId);

    if (!user) return next(Errors.notFound('User not found'));

    req.User = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return next(Errors.unauthorized('Token expired'));

    if (error instanceof JsonWebTokenError)
      return next(Errors.unauthorized('invalid token'));

    next(error);
  }
};
