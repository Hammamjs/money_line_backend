export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
    this.statusCode = statusCode;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
