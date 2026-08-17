import { eq } from 'drizzle-orm';
import { accountsTable } from '../../db/schema.js';
import { db } from '../config/db.js';
import type {
  CreateAccountRecord,
  UpdateAccountInput,
} from '../types/account.js';

export const accountsRepository = {
  create: async ({
    userId,
    accountNumber,
    iban,
    phone,
    bankName,
    ibanHash,
    accountNumberHash,
    label,
    type,
    extraInfo,
    isDefault,
  }: CreateAccountRecord) => {
    const [account] = await db
      .insert(accountsTable)
      .values({
        userId,
        accountNumber,
        iban,
        bankName,
        accountNumberHash,
        ibanHash,
        isDefault,
        label,
        extraInfo,
        type,
        phone,
      })
      .returning();

    return account ?? null;
  },

  exists: async ({
    ibanHash,
    accountNumberHash,
  }: Pick<CreateAccountRecord, 'ibanHash' | 'accountNumberHash'>) => {
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

  getAll: async (userId: string) => {
    return db.query.accountsTable.findMany({ where: { userId } });
  },

  getByUserId: async (userId: string) => {
    return (
      db.query.accountsTable.findMany({
        where: { userId },
        columns: {
          ibanHash: false,
          accountNumberHash: false,
        },
      }) ?? null
    );
  },

  getById: async (id: string) => {
    return (
      db.query.accountsTable.findMany({
        where: { id },
        columns: {
          ibanHash: false,
          accountNumberHash: false,
        },
      }) ?? null
    );
  },

  update: async (id: string, data: UpdateAccountInput) => {
    const [account] = await db
      .update(accountsTable)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(accountsTable.id, id))
      .returning();

    return account ?? null;
  },

  delete: async (id: string) => {
    const [account] = await db
      .delete(accountsTable)
      .where(eq(accountsTable.id, id))
      .returning();

    return account ?? null;
  },
};
