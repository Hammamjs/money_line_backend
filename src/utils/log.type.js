import { appLog } from './log.js';

export const logErrors = (message) => {
  const entry = `${new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(new Date())} ${message}\n`;

  appLog(entry, 'errors');
};

export const logWarn = (message) => {
  const entry = `${new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(new Date())} ${message}\n`;

  appLog(entry, 'warn');
};
