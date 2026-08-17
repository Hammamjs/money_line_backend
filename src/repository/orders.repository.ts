import { and, eq } from 'drizzle-orm';
import { ordersTable } from '../../db/schema.js';
import { db } from '../config/db.js';
import type {
  CreateOrderRecord,
  OrderSatatusInput,
  UpdateOrderInput,
} from '../types/orders.js';

export const ordersRepository = {
  create: async ({
    userId,
    phone,
    accountHolderName,
    paymentProvider,
    transactionProof,
    fromCurrencyId,
    toCurrencyId,
    note,
    amount,
    transactorId,
  }: CreateOrderRecord) => {
    const [order] = await db
      .insert(ordersTable)
      .values({
        userId,
        transactionProof,
        accountHolderName,
        paymentProvider,
        phone,
        fromCurrencyId,
        toCurrencyId,
        note,
        amount,
        transactorId,
      })
      .returning();

    return order ?? null;
  },

  updateStatus: async (
    id: string,
    transactorId: string,
    { status }: { status: OrderSatatusInput },
  ) => {
    const [order] = await db
      .update(ordersTable)
      .set({ status })
      .where(
        and(eq(ordersTable.id, id), eq(ordersTable.transactorId, transactorId)),
      )
      .returning();

    return order ?? null;
  },

  update: async (id: string, data: UpdateOrderInput) => {
    const [order] = await db
      .update(ordersTable)
      .set(data)
      .where(eq(ordersTable.id, id))
      .returning();

    return order ?? null;
  },

  getById: async (id: string) => {
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

  getAll: async ({
    status,
    transactorId,
  }: {
    status: OrderSatatusInput | undefined;
    transactorId: string | undefined;
  }) => {
    return db.query.ordersTable.findMany({
      where: {
        ...(status !== undefined && { status }),
        ...(transactorId !== undefined && { transactorId }),
      },
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  },

  getByUserId: async (userId: string) => {
    return await db.query.ordersTable.findMany({
      where: { userId },
      with: {
        toCurrency: {
          columns: {
            code: true,
            flag: true,
            name: true,
          },
        },
        fromCurrency: {
          columns: {
            code: true,
            flag: true,
            name: true,
          },
        },
      },
    });
  },

  delete: async (id: string) => {
    const [order] = await db
      .delete(ordersTable)
      .where(eq(ordersTable.id, id))
      .returning();

    return order ?? null;
  },
};
