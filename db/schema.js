import { sql } from 'drizzle-orm';
import {
  boolean,
  decimal,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'user']);

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 60 }).notNull(),
  refreshToken: varchar('refresh_token', { length: 70 }).array(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  }).defaultNow(),
  role: userRole('role').notNull().default('user'),
});

export const currencyTable = pgTable('currency', {
  id: uuid('id').defaultRandom().primaryKey(),
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
    id: uuid('id').defaultRandom().primaryKey(),

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

export const orderStatusEnum = pgEnum('order_status', ['pending', 'success']);

export const ordersTable = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderCount: serial('order_count').notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  transactionProof: varchar('payment_proof', { length: 200 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  accountHolderName: varchar('account_holder_name', { length: 30 }).notNull(),
  paymentProvider: varchar('payment_provider', { length: 30 }).notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  fromCurrency: varchar('from_currency', { length: 30 }).notNull(),
  toCurrency: varchar('to_currency', { length: 30 }).notNull(),
  note: varchar('note', { length: 255 }),
  amount: decimal('amount').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const notificationStatus = pgEnum('notification_status', [
  'unread',
  'read',
]);

export const notificationsTable = pgTable('notifications', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  message: varchar('message', { length: 200 }).notNull(),
  status: notificationStatus('status').notNull().default('unread'),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const accountsTable = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  accountNumber: varchar('account_number', { length: 255 }).notNull(),
  accountNumberHash: varchar('account_number_hash', { length: 255 }).notNull(),
  bankName: varchar('bank_name', { length: 255 }).notNull(),
  iban: varchar('iban', { length: 255 }).notNull(),
  ibanHash: varchar('hashed_iban', { length: 255 }).notNull(),
  phoneNumber: varchar('phone_number').notNull(),
  isDefault: boolean('isDefault').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
