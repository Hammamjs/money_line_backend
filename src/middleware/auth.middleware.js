import 'dotenv/config';
import { Errors } from '../errors/map.errors.js';
import jwt from 'jsonwebtoken';
import { usersRepository } from '../repository/users.repository.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return next(Errors.unauthorized('Authentication required'));

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    const user = await usersRepository.getById(decoded.userId);

    if (!user) return next(Errors.notFound('User not found'));

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError')
      return next(Errors.unauthorized('Token expired'));

    if (error.name === 'JsonWebTokenError')
      return next(Errors.unauthorized('invalid token'));

    next(error);
  }
};
