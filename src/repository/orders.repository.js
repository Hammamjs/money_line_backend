import { eq } from 'drizzle-orm';
import { ordersTable } from '../../db/schema.js';
import { db } from '../config/db.js';

export const ordersRepository = {
  create: async ({
    userId,
    phone,
    accountHolderName,
    paymentProvider,
    transactionProof,
    fromCurrency,
    toCurrency,
    note,
    amount,
  }) => {
    const [order] = await db
      .insert(ordersTable)
      .values({
        userId,
        transactionProof,
        accountHolderName,
        paymentProvider,
        phone,
        fromCurrency,
        toCurrency,
        note,
        amount,
      })
      .returning();

    return order ?? null;
  },

  updateStatus: async (id, { status }) => {
    console.log('From repo', status);
    const [order] = await db
      .update(ordersTable)
      .set({ status })
      .where(eq(ordersTable.id, id))
      .returning();

    return order ?? null;
  },

  update: async (id, data) => {
    const [order] = await db
      .update(ordersTable)
      .set(data)
      .where(eq(ordersTable.id, id))
      .returning();

    return order ?? null;
  },

  getById: async (id) => {
    console.log('From repo ', id);
    return db.query.ordersTable.findFirst({
      where: { id },
      with: {
        user: {
          columns: {
            username: true,
            id: true,
          },
        },
      },
    });
  },

  getAll: async ({ status } = {}) => {
    return db.query.ordersTable.findMany({
      where: status ? eq(ordersTable.status, status) : undefined,
    });
  },

  getByUserId: async ({ userId }) => {
    return await db.query.ordersTable.findMany({
      where: { userId },
    });
  },

  delete: async (id) => {
    const [order] = await db
      .delete(ordersTable)
      .where(eq(ordersTable.id, id))
      .returning();

    return order ?? null;
  },
};
