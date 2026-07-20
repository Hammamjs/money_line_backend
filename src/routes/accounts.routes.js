import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createAccountValidation,
  deleteAccountByIdValidation,
  getAccountByIdValidation,
  updateAccountValidation,
} from '../validator/accounts.validation.js';
import { accountController } from '../controller/accounts.controller.js';

const router = Router();

router.use(authMiddleware);

router
  .route('/')
  .get(accountController.getAll)
  .post(createAccountValidation, accountController.create);

router
  .route('/:id')
  .get(getAccountByIdValidation, accountController.getById)
  .patch(updateAccountValidation, accountController.update)
  .delete(deleteAccountByIdValidation, accountController.delete);

export const AccountsRoutes = router;
