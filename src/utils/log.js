import promises from 'fs/promises';
import path from 'path';
import { cwd } from 'process';

export const appLog = async (message, logType) => {
  const logDir = path.join(cwd(), 'logs');

  await promises.mkdir(logDir, { recursive: true });

  const logPath = path.join(logDir, `${logType}.log`);

  await promises.appendFile(logPath, message, { encoding: 'utf8' });
};
