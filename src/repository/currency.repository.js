import { eq } from 'drizzle-orm';
import { currencyTable } from '../../db/schema.js';
import { db } from '../config/db.js';

export const currencyRepository = {
  create: async ({ name, code, symbol }) => {
    const [currency] = await db
      .insert(currencyTable)
      .values({
        name,
        code,
        symbol,
      })
      .returning();

    return currency ?? null;
  },

  update: async (id, data) => {
    const [currency] = await db
      .update(currencyTable)
      .set(data)
      .where(eq(currencyTable.id, id))
      .returning();

    return currency ?? null;
  },

  getById: async (id) => {
    const [currency] = await db
      .select()
      .from(currencyTable)
      .where(eq(currencyTable.id, id))
      .limit(1);

    return currency ?? null;
  },

  delete: async (id) => {
    const [currency] = await db
      .delete(currencyTable)
      .where(eq(currencyTable.id, id))
      .returning();

    return currency ?? null;
  },
};
