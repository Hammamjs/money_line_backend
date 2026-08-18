import type { IncomingMessage, ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import { Server as SocketIoServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import type { JWTPayloads } from './types/auth.js';

let io: SocketIoServer;
export const initializeSocket = (server: HttpServer) => {
  io = new SocketIoServer(server, {
    cors: {
      origin: '*',
    },
  });

  // auth middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) next(new Error('Authentication is required'));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET!);

      socket.user = decoded as JWTPayloads;

      return next();
    } catch (err) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const id = socket.user.id;

    socket.join(`role:${socket.user.role}`);
    socket.join(`user:${id}`);

    console.log(`${id}: connected `);

    socket.on('disconnect', () => {
      console.log(`${id}: disconnected`);
    });

    socket.on('message', (data) => {
      const message = data.toString('hex');
    });
  });
};

export const getIo = () => {
  if (!io) throw new Error('Socket.io has not been initizlied');

  return io;
};
