import type { NextFunction, Request, Response } from 'express';
import { Errors } from '../errors/map-errors.js';

export const restrictedTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.User) return next(Errors.unauthorized('Authentication required'));

    const role = req.User.role;

    if (!roles.includes(role))
      return next(
        Errors.forbidden('You do not have permission to access this resource'),
      );
    next();
  };
};
