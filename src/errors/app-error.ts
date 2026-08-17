export class AppError extends Error {
  public status: string;
  public statusCode: number;
  public isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
    this.statusCode = statusCode;

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
