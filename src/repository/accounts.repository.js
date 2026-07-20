import { eq } from 'drizzle-orm';
import { accountsTable } from '../../db/schema.js';
import { db } from '../config/db.js';

export const accountsRepository = {
  create: async ({
    userId,
    accountNumber,
    iban,
    phoneNumber,
    bankName,
    ibanHash,
    accountNumberHash,
    isDefault,
  }) => {
    const [account] = await db
      .insert(accountsTable)
      .values({
        userId,
        accountNumber,
        iban,
        phoneNumber,
        bankName,
        accountNumberHash,
        ibanHash,
        isDefault,
      })
      .returning();

    return account ?? null;
  },

  exists: async ({ ibanHash, accountNumberHash }) => {
    return (
      db.query.accountsTable.findFirst({
        where: { ibanHash, accountNumberHash },
        columns: {
          ibanHash: true,
          accountNumberHash: true,
        },
      }) ?? null
    );
  },

  getAll: async (userId) => {
    return db.query.accountsTable.findMany({ where: { userId } });
  },

  getById: async (id) => {
    return (
      db.query.accountsTable.findFirst({
        where: { id },
        columns: {
          ibanHash: false,
          accountNumberHash: false,
        },
      }) ?? null
    );
  },

  update: async (id, data) => {
    const [account] = await db
      .update(accountsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(accountsTable.id, id))
      .returning();

    return account ?? null;
  },

  delete: async (id) => {
    const [account] = await db
      .delete(accountsTable)
      .where(eq(accountsTable.id, id))
      .returning();

    return account ?? null;
  },
};
