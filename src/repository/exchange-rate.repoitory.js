import { and, eq } from 'drizzle-orm';
import { exchangeRatesTable } from '../../db/schema.js';
import { db } from '../config/db.js';

export const exchangeRateRepository = {
  create: async ({ fromCurrencyId, toCurrencyId, rate }) => {
    const [exchangeRate] = await db
      .insert(exchangeRatesTable)
      .values({ fromCurrencyId, toCurrencyId, rate })
      .returning();

    return exchangeRate ?? null;
  },

  update: async (id, { rate }) => {
    const [exchangeRate] = await db
      .update(exchangeRatesTable)
      .set({ rate, updatedAt: new Date() })
      .where(eq(exchangeRatesTable.id, id))
      .returning();

    return exchangeRate ?? null;
  },

  getAll: async () => {
    return await db.query.exchangeRatesTable.findMany({
      with: {
        fromCurrency: true,
        toCurrency: true,
      },
    });
  },

  getByCurrencyPair: async ({ fromCurrencyId, toCurrencyId }) => {
    return db.query.exchangeRatesTable.findFirst({
      where: and(
        eq(exchangeRatesTable.fromCurrencyId, fromCurrencyId),
        eq(exchangeRatesTable.toCurrencyId, toCurrencyId),
      ),
      with: {
        fromCurrency: true,
        toCurrency: true,
      },
    });

    return exchangeRate;
  },

  getById: async (id) => {
    const [exchangeRate] = await db
      .select()
      .from(exchangeRatesTable)
      .where(eq(exchangeRatesTable.id, id));

    return exchangeRate ?? null;
  },

  delete: async (id) => {
    const [exchangeRate] = await db
      .delete(exchangeRatesTable)
      .where(eq(exchangeRatesTable.id, id))
      .returning();

    return exchangeRate ?? null;
  },
};
