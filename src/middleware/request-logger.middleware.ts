import type { Request, Response, NextFunction } from 'express';
import { requestContext } from '../logging/context.js';
import { logInfo } from '../logging/log-type.js';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId =
    (req.headers['x-request-id'] as string) || crypto.randomUUID();

  const startTime = Date.now();

  const store = {
    requestId,
    ip: req.ip || req.socket.remoteAddress,
  };

  requestContext.run(store, () => {
    res.on('finish', () => {
      const duration = Date.now() - startTime;

      logInfo('HTTP Request Complete', {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        duration,
      });
    });
    next();
  });
};
