import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { restrictedTo } from '../middleware/restricted-to.middleware.js';
import { Role } from '../constants/role.js';
import { exchangeRateController } from '../controllers/exchange-rate.controller.js';
import {
  createExchangeRateValidation,
  deleteExchangeRateValidation,
  getCurrencyPairValidation,
  getExchangeRateByIdValidation,
  updateExchangeRateValidation,
} from '../validator/exchange-rate-validation.js';

const router = Router();

router
  .route('/')
  .get(exchangeRateController.getAll)
  .post(
    authMiddleware,
    restrictedTo(Role.ADMIN),
    createExchangeRateValidation,
    exchangeRateController.create,
  );

router.get(
  '/rate',
  getCurrencyPairValidation,
  exchangeRateController.getCurrencyPair,
);

router
  .route('/:id')
  .get(getExchangeRateByIdValidation, exchangeRateController.getById)
  .patch(
    authMiddleware,
    restrictedTo(Role.ADMIN),
    updateExchangeRateValidation,
    exchangeRateController.update,
  )
  .delete(
    authMiddleware,
    deleteExchangeRateValidation,
    exchangeRateController.delete,
  );

export const ExchangeRateRoutes = router;
