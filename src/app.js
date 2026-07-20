import 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import { fileURLToPath } from 'url';
import path from 'path';
import { handleError } from './errors/global.error.js';
import { routes } from './routes/index.js';
import { registerOrderSocketEvent } from './socket/order.socket.js';
import { corsOption } from './config/cors.options.js';

const app = express();

app.use(cors(corsOption));

app.use(helmet());

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
