import express from 'express';
import 'dotenv/config';
import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import { handleError } from './errors/global.error.js';
import { routes } from './routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
  cors({
    origin: '*',
  }),
);

// middlewares

app.use(express.json());

app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
// routes
routes(app);

// catch global error
app.use(handleError);

export default app;
