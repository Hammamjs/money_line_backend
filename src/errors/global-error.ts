import 'dotenv/config';
import type { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  status?: string;
}

const prodError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: error.message ?? 'Something went wrong',
  });
};

const devError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statusCode = error.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message: error.message,
    stack: error.stack,
    error,
  });
};

export const handleError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  return process.env.NODE_ENV === 'development'
    ? devError(error, req, res, next)
    : prodError(error, req, res, next);
};
