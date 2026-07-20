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
    return db.query.exchangeRatesTable.findMany({
      with: {
        fromCurrency: true,
        toCurrency: true,
      },
    });
  },

  getByCurrencyPair: async ({ fromCurrencyId, toCurrencyId }) => {
    return db.query.exchangeRatesTable.findFirst({
      where: { fromCurrencyId, toCurrencyId },
      with: {
        fromCurrency: true,
        toCurrency: true,
      },
    });
  },

  getById: async (id) => {
    return db.query.exchangeRatesTable.findFirst({
      where: eq(exchangeRatesTable.id, id),
      with: {
        fromCurrency: true,
        toCurrency: true,
      },
    });
  },

  delete: async (id) => {
    const [exchangeRate] = await db
      .delete(exchangeRatesTable)
      .where(eq(exchangeRatesTable.id, id))
      .returning();

    return exchangeRate ?? null;
  },
};
