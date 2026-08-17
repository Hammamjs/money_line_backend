import type { NextFunction, Request, Response } from 'express';
import type { User } from '../types/users.js';
import { sanitizeUser } from '../utils/sanitize-user.js';

export const sanitizeUserMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const originalJsonResponse = res.json.bind(res);

  res.json = function (data: any) {
    if (data && typeof data === 'object') {
      if (Array.isArray(data.users)) {
        data.users = data.users.map((u: User) => sanitizeUser(u));
      }

      if (data.user) {
        data.user = sanitizeUser(data.user);
      }
    }

    return originalJsonResponse(data);
  };
  next();
};
