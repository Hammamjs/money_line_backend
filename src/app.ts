import 'dotenv/config';

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import { fileURLToPath } from 'url';
import path from 'path';
import { handleError } from './errors/global-error.js';
import { routes } from './routes/index.js';
import { registerOrderSocketEvent } from './dispatcher/order-send-email-event.js';
import { registerSendResetPasswordCode } from './dispatcher/reset-password-send-email-event.js';
import { corsOption } from './config/cors-options.js';
import { requestLogger } from './middleware/request-logger.middleware.js';
import { sanitizeUserMiddleware } from './middleware/sanitize-user.middleware.js';

const app = express();

app.use(cors(corsOption));
app.use(helmet());
app.use(express.json({ limit: '60kb' }));
app.use(cookieParser());

// middlewares

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
// measure how much server take to repsonse
app.use(requestLogger);

// check health endpoint
app.get('/status', async (req, res) => {
  return res.sendStatus(200);
});

// global sanitization for user respone to exclude sensitive fields
app.use(sanitizeUserMiddleware);

// routes
routes(app);

// catch global error
app.use(handleError);

export default app;
