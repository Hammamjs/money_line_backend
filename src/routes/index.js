import { UserRoutes } from './users.routes.js';
import { AuthRoutes } from './auth.routes.js';
import { CurrencyRoutes } from './currency.routes.js';

export const routes = (app) => {
  app.use('/api/users', UserRoutes);
  app.use('/api/auth', AuthRoutes);
  app.use('/api/currency', CurrencyRoutes);
};
