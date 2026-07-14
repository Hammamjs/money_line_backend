import { relations, sql } from 'drizzle-orm';
import {
  decimal,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'user']);

export const usersTable = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: varchar('username', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 255 }),
  refreshToken: varchar('refresh_token', { length: 255 }),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  }).defaultNow(),
  role: userRole('role').notNull().default('user'),
});

export const currencyTable = pgTable('currency', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar({ length: 20 }, 'name').notNull(),
  code: varchar({ length: 3 }, 'code').notNull(),
  symbol: varchar({ length: 100 }, 'symbol').notNull(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  }).defaultNow(),
});

export const exchangeRatesTable = pgTable(
  'exchange_rates',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    fromCurrencyId: uuid('from_currency_id')
      .notNull()
      .references(() => currencyTable.id),

    toCurrencyId: uuid('to_currency_id')
      .notNull()
      .references(() => currencyTable.id),

    rate: decimal('rate', {
      precision: 18,
      scale: 6,
    }).notNull(),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    uniqueCurrencyPair: unique('exchange_rates_currency_pair_unique').on(
      table.fromCurrencyId,
      table.toCurrencyId,
    ),
  }),
);

export const currencyRelations = relations(currencyTable, ({ many }) => ({
  exchangeRatesFrom: many(exchangeRatesTable, {
    relationName: 'fromCurrency',
  }),
  exchangeRatesTo: many(exchangeRatesTable, {
    relationName: 'toCurrency',
  }),
}));

export const exchangeRatesTableRelations = relations(
  exchangeRatesTable,
  ({ one }) => ({
    fromCurrency: one(currencyTable, {
      fields: [exchangeRatesTable.fromCurrencyId],
      references: [currencyTable.id],
      relationName: 'fromCurrency',
    }),

    toCurrency: one(currencyTable, {
      fields: [exchangeRatesTable.toCurrencyId],
      references: [currencyTable.id],
      relationName: 'toCurrency',
    }),
  }),
);
