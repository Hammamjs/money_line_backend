import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { requestContext } from './context.js';

type LogType = 'info' | 'error' | 'warn';

const logDir = path.join(cwd(), 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const streams = {
  error: fs.createWriteStream(path.join(logDir, 'error.log'), { flags: 'a' }),
  warn: fs.createWriteStream(path.join(logDir, 'warn.log'), { flags: 'a' }),
  info: fs.createWriteStream(path.join(logDir, 'info.log'), { flags: 'a' }),
};

export const appLog = (data: string | object, logType: LogType = 'info') => {
  const store = requestContext.getStore();
  const payload = {
    timestamp: new Date().toISOString(),
    level: logType.toUpperCase(),
    ...(store ? { requestId: store.requestId, ip: store.ip } : {}),
    ...(typeof data === 'string' ? { message: data } : data),
  };

  const formattedLog = JSON.stringify(payload) + '\n';

  const targetStream = streams[logType] || streams.info;

  targetStream.write(formattedLog);
  process.stdout.write(formattedLog);
};
