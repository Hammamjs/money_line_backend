import { appLog } from './log.js';

export const logError = (message: string, context: object = {}) => {
  appLog({ message, ...context }, 'error');
};

export const logInfo = (message: string, context: object = {}) => {
  appLog({ message, context }, 'info');
};

export const logWarn = (message: string, context: object = {}) => {
  appLog({ message, context }, 'warn');
};
