import { Errors } from '../utils/map.errors.js';
import { usersRepository } from '../repository/users.repository.js';

export const usersService = {
  create: async ({ username, email, phone }) => {
    if (!username || !email)
      throw Errors.badRequest('Email and username is required');

    const isExist = await usersRepository.getByEmail(email);

    if (isExist) throw Errors.conflict('Email already exists');

    return usersRepository.create({
      username,
      email,
      phone,
      role: 'user',
    });
  },

  findAll: async () => {
    const users = await usersRepository.getAll();

    if (!users.length) return [];

    return users.map(({ password, refreshToken, user }) => user);
  },
};
