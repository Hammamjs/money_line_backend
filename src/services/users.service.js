import { Errors } from '../errors/map.errors.js';
import { usersRepository } from '../repository/users.repository.js';
import { sanitizeUser } from '../utils/sanitize.user.js';

export const usersService = {
  findAll: async () => {
    const users = await usersRepository.getAll();

    if (!users.length) return [];

    return users.map((user) => sanitizeUser(user));
  },

  update: async (id, { username }) => {
    if (!id) throw Errors.badRequest('Id not provided');

    if (!username) throw Errors.badRequest('user name is required to update');

    const user = await usersRepository.update(id, { username });

    if (!user) throw Errors.notFound('Failed to update no user found');

    return {
      user: sanitizeUser(user),
    };
  },

  findById: async (id) => {
    if (!id) throw Errors.badRequest('id params not provided');

    const user = await usersRepository.getById(id);

    if (!user) throw Errors.notFound('No user found');

    return { user: sanitizeUser(user) };
  },

  delete: async (id) => {
    if (!id) throw Errors.badRequest('id params not provided');

    const deletedUser = await usersRepository.delete(id);

    if (!deletedUser)
      throw Errors.notFound(`User not found with this id ${id}`);

    return {
      user: sanitizeUser(deletedUser),
    };
  },
};
