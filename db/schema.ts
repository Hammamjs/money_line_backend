import { sql } from 'drizzle-orm';
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['admin', 'user', 'super_admin']);

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 60 }),
  googleId: varchar('google_id', { length: 100 }).unique(),
  refreshToken: varchar('refresh_token', { length: 70 }).array(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  }).defaultNow(),
  role: userRole('role').notNull().default('user'),
});

export const currencyTable = pgTable(
  'currency',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 20 }).notNull(),
    code: varchar('code', { length: 3 }).notNull(),
    symbol: varchar('symbol', { length: 100 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
    flag: varchar('flag', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', {
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp('updated_at', {
      withTimezone: true,
    }).defaultNow(),
  },
  (table) => [
    uniqueIndex('currencies_name_unique').on(sql`Lower(${table.name})`),
    uniqueIndex('currencies_code_unique').on(sql`Lower(${table.code})`),
  ],
);

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

    isActive: boolean('is_active').notNull().default(true),

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
  orderCount: integer('order_count').generatedByDefaultAsIdentity().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, {
      onDelete: 'cascade',
    }),
  transactorId: uuid('transactor_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  transactionProof: varchar('payment_proof', { length: 200 }).notNull(),
  phone: varchar('phone', { length: 30 }).notNull(),
  accountHolderName: varchar('account_holder_name', { length: 30 }).notNull(),
  paymentProvider: varchar('payment_provider', { length: 30 }).notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  fromCurrencyId: uuid('from_currency_id')
    .notNull()
    .references(() => currencyTable.id, {
      onDelete: 'cascade',
    }),
  toCurrencyId: uuid('to_currency_id')
    .notNull()
    .references(() => currencyTable.id, {
      onDelete: 'cascade',
    }),
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
  title: varchar('title', { length: 100 }).notNull(),
  status: notificationStatus('status').notNull().default('unread'),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const BankType = pgEnum('bank_type', ['Bank', 'Wallet']);

export const accountsTable = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 255 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  extraInfo: varchar('extra_info', { length: 255 }),
  type: BankType('type').notNull(),
  accountNumber: varchar('account_number', { length: 255 }).notNull(),
  accountNumberHash: varchar('account_number_hash', { length: 255 }).notNull(),
  bankName: varchar('bank_name', { length: 255 }).notNull(),
  iban: varchar('iban', { length: 255 }).notNull(),
  ibanHash: varchar('hashed_iban', { length: 255 }).notNull(),
  phone: varchar('phone_number').notNull(),
  isDefault: boolean('isDefault').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
