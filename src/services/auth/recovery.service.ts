import redisClient from '@/src/config/redis.js';
import { Errors } from '@/src/errors/map-errors.js';
import { appEvent } from '@/src/events/app-events.js';
import { EVENTS } from '@/src/events/app-events-name.js';
import { authRepository } from '@/src/repository/auth.repository.js';
import { usersRepository } from '@/src/repository/users.repository.js';
import type { ResetCodeInput, VerifyResetCode } from '@/src/types/auth.js';
import { hash } from 'bcrypt';
import { createHash, randomInt } from 'crypto';

export const recoveryService = {
  forgetPassword: async ({ email }: { email: string }) => {
    if (!email) throw Errors.badRequest('Email is requred');

    const user = await usersRepository.getByEmail(email);

    if (!user) throw Errors.notFound('user not found');

    const resetCode = randomInt(100000, 1000000);

    const hashedCode = createHash('sha256')
      .update(String(resetCode))
      .digest('hex');

    const hashKey = `reset-password:${user.id}`;

    // we should delete the old code if exist
    await redisClient.del(hashKey);

    await redisClient.set(hashKey, hashedCode, {
      EX: 600,
    });

    // send email to user side Effect event
    appEvent.emit(EVENTS.FORGET_PASSWORD, { user, resetCode });
    return { message: 'Rest code sent to your email' };
  },

  verifyResetCode: async ({ email, resetCode }: VerifyResetCode) => {
    if (!email || !resetCode)
      throw Errors.badRequest('Missing required fields');

    const user = await usersRepository.getByEmail(email);

    if (!user) throw Errors.notFound('User not exists');

    const hashedKey = `reset-password:${user.id}`;

    const storedCode = await redisClient.get(hashedKey);

    if (!storedCode)
      throw Errors.badRequest('Reset password code not found or expired');

    const hashedCode = createHash('sha256')
      .update(String(resetCode))
      .digest('hex');

    if (hashedCode !== storedCode)
      throw Errors.badRequest('Incorrect reset code');

    await redisClient.del(hashedKey);

    await redisClient.set(`reset-verified:${user.id}`, 'true', {
      EX: 600, // 10 minutes
    });

    return {
      message: 'Reset your password',
    };
  },

  resetPassword: async ({ newPassword, email }: ResetCodeInput) => {
    if (!newPassword || !email)
      throw Errors.badRequest('Missing required fields');

    const user = await usersRepository.getByEmail(email);

    if (!user) throw Errors.notFound('User not found');

    const hashedKey = `reset-verified:${user.id}`;

    const isVerified = await redisClient.get(hashedKey);

    if (!isVerified) throw Errors.unauthorized('Reset code not verified');

    const hashedNewPassword = await hash(
      newPassword,
      Number(process.env.HASH_SALT) || 12,
    );

    const updatedUser = await authRepository.updatePassword(user.id, {
      password: hashedNewPassword,
    });

    if (!updatedUser) throw Errors.internal('Password update failed');

    await redisClient.del(hashedKey);

    return {
      message: 'Password updated successfully',
    };
  },
};
