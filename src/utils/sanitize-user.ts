import type { User } from '../types/users.js';

export const sanitizeUser = (user: User) => {
  const { password, refreshToken, ...safeUser } = user;

  return safeUser;
};
