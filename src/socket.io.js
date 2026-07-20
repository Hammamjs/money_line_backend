import { Server } from 'socket.io';

let io;
export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;

    socket.join(userId);

    console.log(`${userId}: connected `);

    socket.on('disconnect', () => {
      console.log(`${userId}: connected `);
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
