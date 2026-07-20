import app from './app.js';
import { createServer } from 'http';
import { initializeSocket } from './socket.io.js';

const PORT = process.env.PORT || 3001;

const httpServer = createServer(app);

initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
