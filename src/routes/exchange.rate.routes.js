import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { restrictedTo } from '../middleware/restricted-to.middleware.js';
import { Role } from '../constant/role.js';
import { exchangeRateController } from '../controller/exchange.rate.controller.js';
import {
  createExchangeRateValidation,
  deleteExchangeRateValidation,
  getExchangeRateByIdValidation,
  updateExchangeRateValidation,
} from '../validator/exchange.rate.validation.js';

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
