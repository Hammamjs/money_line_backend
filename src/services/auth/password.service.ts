import { Errors } from '@/src/errors/map-errors.js';
import { authRepository } from '@/src/repository/auth.repository.js';
import { usersRepository } from '@/src/repository/users.repository.js';
import type { updatePasswordInput } from '@/src/types/auth.js';
import { compare, hash } from 'bcrypt';

export const passwordService = {
  updatePassword: async ({
    userId,
    newPassword,
    currentPassword,
  }: updatePasswordInput) => {
    if (!newPassword) throw Errors.badRequest('Nothing to update');

    const user = await usersRepository.getById(userId);

    if (!user) throw Errors.notFound('User not found');

    // if account linked with google
    if (!user.password)
      throw Errors.notFound(
        'This account does not have a password. Please set a password first.',
      );

    const isMatchOldPass = await compare(currentPassword, user.password);

    if (!isMatchOldPass) throw Errors.badRequest('Current password Incorrect');

    if (currentPassword === newPassword)
      throw Errors.badRequest('Current password and new Password are same');

    const hashedPassword = await hash(
      newPassword,
      Number(process.env.HASH_SALT) || 12,
    );

    const updateUser = await authRepository.updatePassword(userId, {
      password: hashedPassword,
    });

    if (!updateUser) throw Errors.notFound('User not found');

    return { message: 'Password updated' };
  },
};
