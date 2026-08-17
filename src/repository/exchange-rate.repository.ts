import { and, eq } from 'drizzle-orm';
import { exchangeRatesTable } from '../../db/schema.js';
import { db } from '../config/db.js';
import type {
  CreateExchangeRateInput,
  GetPairCurrencyInput,
  UpdateExchangeRateInput,
} from '../types/exchange-rate.js';

export const exchangeRateRepository = {
  create: async ({ fromId, toId, rate }: CreateExchangeRateInput) => {
    const [exchangeRate] = await db
      .insert(exchangeRatesTable)
      .values({ fromCurrencyId: fromId, toCurrencyId: toId, rate })
      .returning();

    return exchangeRate ?? null;
  },

  update: async ({ id, rate, isActive }: UpdateExchangeRateInput) => {
    const [exchangeRate] = await db
      .update(exchangeRatesTable)
      .set({ rate, isActive, updatedAt: new Date() })
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

  getByCurrencyPair: async ({ fromId, toId }: GetPairCurrencyInput) => {
    return db.query.exchangeRatesTable.findFirst({
      where: { fromCurrencyId: fromId, toCurrencyId: toId, isActive: true },
      with: {
        fromCurrency: true,
        toCurrency: true,
      },
    });
  },

  getById: async (id: string) => {
    return db.query.exchangeRatesTable.findFirst({
      where: { id },
      with: {
        fromCurrency: true,
        toCurrency: true,
      },
    });
  },

  delete: async (id: string) => {
    const [exchangeRate] = await db
      .delete(exchangeRatesTable)
      .where(eq(exchangeRatesTable.id, id))
      .returning();

    return exchangeRate ?? null;
  },
};
