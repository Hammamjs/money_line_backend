import type { NextFunction, Response, Request } from 'express';
import { validationResult } from 'express-validator';

export const validation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      sucess: false,
      errors: errors.array(),
    });
  }

  next();
};
