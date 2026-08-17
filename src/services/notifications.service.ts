import { Errors } from '../errors/map-errors.js';
import { notificationRepository } from '../repository/notifications.repository.js';
import { getIo } from '../socket-io.js';
import { usersRepository } from '../repository/users.repository.js';
import type { CreateNotificationInput } from '../types/notification.js';

export const notificationsService = {
  create: async ({ message, userId, title }: CreateNotificationInput) => {
    if (!userId || !message || message.trim() === '')
      throw Errors.badRequest('Required fields are missing');

    const notification = await notificationRepository.create({
      userId,
      message,
      title,
    });

    const io = getIo();

    io.to(`user:${userId}`).emit('notifications', notification);

    return notification;
  },

  update: async (userId: string) => {
    if (!userId) throw Errors.badRequest('Notification userId is required');

    const notification = await notificationRepository.update(userId);

    if (!notification) throw Errors.notFound('notification not found');

    return notification;
  },

  updateOne: async (id: string) => {
    if (!id) throw Errors.badRequest('Notification id is required');

    const notification = await notificationRepository.updateOne(id);

    if (!notification) throw Errors.notFound('notification not found');

    return notification;
  },

  getById: async (id: string) => {
    if (!id) throw Errors.badRequest('Notification ID is required');

    const notification = await notificationRepository.getById(id);

    if (!notification) throw Errors.notFound('Notification not found');

    return notification;
  },

  getByUserId: async (userId: string) => {
    if (!userId) throw Errors.badRequest('User ID is required');

    const notifications = await notificationRepository.getByUserId(userId);

    return notifications;
  },

  notifyUsers: async ({
    message,
    title,
  }: Omit<CreateNotificationInput, 'userId'>) => {
    if (!message || message.trim() === '')
      throw Errors.badRequest('Message is required');
    const users = await usersRepository.getAll({ role: 'user' });

    if (!users || users.length === 0) return;

    const io = getIo();

    const notifications = users.map(({ id }) => ({
      userId: id,
      message,
      title,
    }));

    await notificationRepository.createMany(notifications);

    io.to('role:user').emit('notifications', { title, message });

    return;
  },

  delete: async (id: string) => {
    if (!id) throw Errors.badRequest('ID is required');

    const notification = await notificationRepository.delete(id);

    if (!notification) throw Errors.notFound('notifications not exists');

    return notification;
  },
};
