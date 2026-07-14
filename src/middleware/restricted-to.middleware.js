import { Errors } from '../errors/map.errors.js';

export const restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return next(Errors.unauthorized('Authentication required'));

    const role = req.user.role;

    if (!roles.includes(role))
      return next(
        Errors.forbidden('You do not have permission to access this resource'),
      );
    next();
  };
};
