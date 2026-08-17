import { eq } from 'drizzle-orm';
import { currencyTable } from '../../db/schema.js';
import { db } from '../config/db.js';
import type {
  CreateCurrencyInput,
  UpdateCurrencyInput,
} from '../types/currency.js';

export const currencyRepository = {
  create: async ({ name, code, symbol, flag }: CreateCurrencyInput) => {
    const [currency] = await db
      .insert(currencyTable)
      .values({
        name,
        code,
        symbol,
        flag,
      })
      .returning();

    return currency ?? null;
  },

  update: async (id: string, data: UpdateCurrencyInput) => {
    const [currency] = await db
      .update(currencyTable)
      .set(data)
      .where(eq(currencyTable.id, id))
      .returning();

    return currency ?? null;
  },

  getAll: async () => {
    return db.query.currencyTable.findMany();
  },

  getById: async (id: string) => {
    const [currency] = await db
      .select()
      .from(currencyTable)
      .where(eq(currencyTable.id, id))
      .limit(1);

    return currency ?? null;
  },

  delete: async (id: string) => {
    const [currency] = await db
      .delete(currencyTable)
      .where(eq(currencyTable.id, id))
      .returning();

    return currency ?? null;
  },
};
