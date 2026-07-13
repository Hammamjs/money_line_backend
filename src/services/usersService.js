import { Errors } from '../utils/map.errors.js';
import { usersRepository } from '../repository/users.repository.js';

export const usersService = {
  findAll: async () => {
    const users = await usersRepository.getAll();

    if (!users.length) return [];

    return users.map(({ password, refreshToken, user }) => user);
  },

  update: async (username, phone, id) => {
    if (!id) throw Errors.badRequest('Id not provided');

    const user = await usersRepository.update({ username, phone, id });

    if (!user) throw Errors.notFound('Failed to update no user found');

    const { password, refreshToken, ...safeUser } = user;

    return safeUser;
  },

  findById: async (id) => {
    if (!id) throw Errors.badRequest('id params not provided');

    const user = await usersRepository.getById(id);

    if (!user) throw Errors.notFound('No user found');

    const { password, refreshToken, ...safeUser } = user;

    return safeUser;
  },

  delete: async (id) => {
    if (!id) throw Errors.badRequest('id params not provided');

    const deletedUser = await usersRepository.delete(id);

    if (!deletedUser)
      throw Errors.notFound(`User not found with this id ${id}`);

    return;
  },
};
