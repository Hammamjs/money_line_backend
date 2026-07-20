import { defineRelations } from 'drizzle-orm';
import {
  currencyTable,
  exchangeRatesTable,
  usersTable,
  ordersTable,
  notificationsTable,
  accountsTable,
} from './schema.js';

const relations = defineRelations(
  {
    currencyTable,
    exchangeRatesTable,
    usersTable,
    ordersTable,
    notificationsTable,
    accountsTable,
  },
  (r) => ({
    exchangeRatesTable: {
      fromCurrency: r.one.currencyTable({
        from: r.exchangeRatesTable.fromCurrencyId,
        to: r.currencyTable.id,
        alias: 'fromCurrency',
      }),
      toCurrency: r.one.currencyTable({
        from: r.exchangeRatesTable.toCurrencyId,
        to: r.currencyTable.id,
        alias: 'toCurrency',
      }),
    },
    currencyTable: {
      exchangeRatesFrom: r.many.exchangeRatesTable({
        from: r.currencyTable.id,
        to: r.exchangeRatesTable.fromCurrencyId,
        alias: 'exchangeRatesFrom',
      }),
      exchangeRatesTo: r.many.exchangeRatesTable({
        from: r.currencyTable.id,
        to: r.exchangeRatesTable.toCurrencyId,
        alias: 'exchangeRatesTo',
      }),
    },

    ordersTable: {
      user: r.one.usersTable({
        from: r.ordersTable.userId,
        to: r.usersTable.id,
        alias: 'user',
      }),
    },

    usersTable: {
      orders: r.many.ordersTable({
        from: r.usersTable.id,
        to: r.ordersTable.userId,
        alias: 'orders',
      }),

      usersTable: {
        notifications: r.many.notificationsTable({
          from: r.usersTable.id,
          to: r.notificationsTable.userId,
        }),
      },
      notificationsTable: {
        user: r.one.usersTable({
          from: r.usersTable.id,
          to: r.notificationsTable.userId,
        }),
      },
    },

    usersTable: {
      accounts: r.many.accountsTable({
        from: r.usersTable.id,
        to: r.accountsTable.userId,
      }),
    },

    accountsTable: {
      user: r.one.usersTable({
        from: r.accountsTable.userId,
        to: r.usersTable.id,
      }),
    },
  }),
);

export default relations;
