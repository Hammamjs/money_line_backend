import { Errors } from '../errors/map.errors.js';
import { notificationRepository } from '../repository/notifications.repository.js';

export const notificationsService = {
  create: async ({ message, userId }) => {
    if (!userId || !message || message.trim() === '')
      throw Errors.badRequest('Required fields are missing');

    const notification = await notificationRepository.create({
      userId,
      message,
    });

    return notification;
  },

  update: async (id) => {
    if (!id) throw Errors.badRequest('Notification ID is required');

    const notification = await notificationRepository.update(id);

    if (!notification) throw Errors.notFound('notification not found');

    return notification;
  },
  getById: async (id) => {
    if (!id) throw Errors.badRequest('Notification ID is required');

    const notification = await notificationRepository.getById(id);

    if (!notification) throw Errors.notFound('Notification not found');

    return notification;
  },
  getByUserId: async (userId) => {
    if (!userId) throw Errors.badRequest('User ID is required');

    const notifications = await notificationRepository.getByUserId(userId);

    return notifications;
  },

  delete: async (id) => {
    if (!id) throw Errors.badRequest('ID is required');

    const notification = await notificationRepository.delete(id);

    if (!notification) throw Errors.notFound('notification not exists');

    return notification;
  },
};
