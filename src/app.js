import express from 'express';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import { handleError } from './utils/globalError.js';
import { UserRoutes } from './routes/users.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: '*',
  }),
);

// middlewares

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
// routes

app.use('/api/users', UserRoutes);

// catch global error
app.use(handleError);

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
