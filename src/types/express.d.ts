import 'express';
import type { Roles } from './users.ts';
import type { JWTPaylaods } from './auth.ts';
declare global {
  namespace Express {
    interface Request {
      User: {
        id: string;
        email: string;
        role: Roles;
      };
    }
  }
}

declare module 'socket.io' {
  interface Socket {
    user: JWTPaylaods;
  }
}
