import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { restrictedTo } from '../middleware/restricted-to.middleware.js';
import { Role } from '../constant/role.js';
import { currencyController } from '../controller/currency.controller.js';
import {
  createCurrencyValidation,
  deleteCurrencyValidation,
  getCurrencyByIdValidation,
  updateCurrencyValidation,
} from '../validator/currency.validation.js';

const router = Router();

router.post(
  '/',
  createCurrencyValidation,
  authMiddleware,
  restrictedTo(Role.ADMIN),
  currencyController.create,
);

router
  .route('/:id')
  .patch(
    updateCurrencyValidation,
    authMiddleware,
    restrictedTo(Role.ADMIN),
    currencyController.update,
  )
  .get(
    getCurrencyByIdValidation,
    authMiddleware,
    restrictedTo(Role.ADMIN),
    currencyController.getById,
  )
  .delete(
    deleteCurrencyValidation,
    authMiddleware,
    restrictedTo(Role.ADMIN),
    currencyController.delete,
  );

export const CurrencyRoutes = router;
