import { UserRoutes } from './users.routes.js';
import { AuthRoutes } from './auth.routes.js';
import { CurrencyRoutes } from './currency.routes.js';
import { ExchangeRateRoutes } from './exchange.rate.routes.js';
import { Router } from 'express';
import { OrdersRoutes } from './orders.routes.js';
import { NotificationsRoutes } from './notification.routes.js';
import { AccountsRoutes } from './accounts.routes.js';

export const routes = (app) => {
  const appRouter = Router();

  appRouter.use('/users', UserRoutes);
  appRouter.use('/auth', AuthRoutes);
  appRouter.use('/currency', CurrencyRoutes);
  appRouter.use('/exchange-rate', ExchangeRateRoutes);
  appRouter.use('/orders', OrdersRoutes);
  appRouter.use('/notifications', NotificationsRoutes);
  appRouter.use('/accounts', AccountsRoutes);

  appRouter.use((req, res) => {
    return res.status(404).json({ status: false, message: 'Route not found' });
  });

  app.use('/api', appRouter);
};
