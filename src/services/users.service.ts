import { Errors } from '../errors/map-errors.js';
import { usersRepository } from '../repository/users.repository.js';
import type { Roles } from '../types/users.js';
import { sanitizeUser } from '../utils/sanitize-user.js';

export const usersService = {
  findAll: async ({ role }: { role: Roles | undefined }) => {
    const users = await usersRepository.getAll({ role });

    if (!users.length) return [];

    return { users };
  },

  updateRole: async (id: string, { role }: { role: Roles }) => {
    if (!id || !role) throw Errors.badRequest('Required fields are missing');

    const allowedRole = ['admin', 'user'] as const;

    if (!allowedRole.includes(role as (typeof allowedRole)[number]))
      throw Errors.badRequest('Invalid role provided');

    const foundUser = await usersRepository.getById(id);

    if (!foundUser) throw Errors.notFound('User not found');

    // prevent to change super admin role to another role
    if (foundUser.role === 'super_admin')
      throw Errors.forbidden("Super admin can't change his role");

    const user = await usersRepository.update(id, { role });

    if (!user) throw Errors.internal('Failed to update user role');

    return user;
  },

  update: async (id: string, { username }: { username: string }) => {
    if (!id) throw Errors.badRequest('Id not provided');

    if (!username) throw Errors.badRequest('user name is required to update');

    const user = await usersRepository.update(id, { username });

    if (!user) throw Errors.notFound('Failed to update no user found');

    return {
      user,
    };
  },

  findById: async (id: string) => {
    if (!id) throw Errors.badRequest('id params not provided');

    const user = await usersRepository.getById(id);

    if (!user) throw Errors.notFound('No user found');

    return { user };
  },

  findByEmail: async (email: string) => {
    if (!email) throw Errors.badRequest('Email is required');
    const user = await usersRepository.getByEmail(email);

    if (!user) throw Errors.badRequest('User not found');

    return { message: 'User is exist' };
  },

  delete: async (id: string) => {
    if (!id) throw Errors.badRequest('id params not provided');

    const deletedUser = await usersRepository.delete(id);

    if (!deletedUser)
      throw Errors.notFound(`User not found with this id ${id}`);

    return {
      user: deletedUser,
    };
  },
};
