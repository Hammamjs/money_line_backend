import { AppError } from './app.error.js';

const STATUS_CODE = {
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  internalServerError: 500,
};

export const Errors = {
  conflict: (message) => {
    return new AppError(message, STATUS_CODE.conflict);
  },

  unauthorized: (message) => {
    return new AppError(message, STATUS_CODE.unauthorized);
  },

  forbidden: (message) => {
    return new AppError(message, STATUS_CODE.forbidden);
  },

  internal: (message) => {
    return new AppError(message, STATUS_CODE.internalServerError);
  },

  notFound: (message) => {
    return new AppError(message, STATUS_CODE.notFound);
  },

  badRequest: (message) => {
    return new AppError(message, STATUS_CODE.badRequest);
  },
};
