import 'dotenv/config';

const prodError = (error, req, res, next) => {
  return res.status(error.statusCode).json({
    success: false,
    statusCode: error,
    message: error.message ?? 'Something went wrong',
  });
};

const devError = (error, req, res, next) => {
  return res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    stack: error.stack,
    error,
  });
};

export const handleError = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  return process.env.NODE_ENV === 'development'
    ? devError(error, req, res, next)
    : prodError(error, req, res, next);
};
