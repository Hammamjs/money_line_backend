import { eq } from 'drizzle-orm';
import { notificationsTable } from '../../db/schema.js';
import { db } from '../config/db.js';

export const notificationRepository = {
  create: async ({ userId, message }) => {
    const [notification] = await db
      .insert(notificationsTable)
      .values({
        userId,
        message,
      })
      .returning();

    return notification;
  },

  update: async (id) => {
    const notification = await db
      .update(notificationsTable)
      .set({ status: 'read' })
      .where(eq(notificationsTable.id, id))
      .returning();

    return notification;
  },

  delete: async (id) => {
    const notification = await db
      .delete(notificationsTable)
      .where(notificationsTable.id, id)
      .returning();

    return notification;
  },

  getById: async (id) => {
    const notification = await db.query.notificationsTable.findFirst({
      where: { id },
    });
    return notification;
  },

  getByUserId: async (userId) => {
    const notifications = await db.query.notificationsTable.findMany({
      where: { userId },
    });

    return notifications;
  },
};
