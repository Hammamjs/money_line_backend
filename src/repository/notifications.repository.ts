import { eq } from 'drizzle-orm';
import { notificationsTable } from '../../db/schema.js';
import { db } from '../config/db.js';
import type { CreateNotificationInput } from '../types/notification.js';

export const notificationRepository = {
  create: async ({ userId, message, title }: CreateNotificationInput) => {
    const [notification] = await db
      .insert(notificationsTable)
      .values({
        userId,
        message,
        title,
      })
      .returning();

    return notification;
  },

  createMany: async (notifications: CreateNotificationInput[]) => {
    if (!notifications || notifications.length === 0) return [];

    return await db.insert(notificationsTable).values(notifications);
  },

  update: async (userId: string) => {
    const notification = await db
      .update(notificationsTable)
      .set({ status: 'read' })
      .where(eq(notificationsTable.userId, userId))
      .returning();

    return notification;
  },

  updateOne: async (id: string) => {
    const notification = await db
      .update(notificationsTable)
      .set({ status: 'read' })
      .where(eq(notificationsTable.id, id))
      .returning();

    return notification;
  },

  delete: async (id: string) => {
    const notification = await db
      .delete(notificationsTable)
      .where(eq(notificationsTable.id, id))
      .returning();

    return notification;
  },

  getById: async (id: string) => {
    const notification = await db.query.notificationsTable.findFirst({
      where: { id },
    });
    return notification;
  },

  getByUserId: async (userId: string) => {
    const notifications = await db.query.notificationsTable.findMany({
      where: { userId },
    });

    return notifications;
  },
};
