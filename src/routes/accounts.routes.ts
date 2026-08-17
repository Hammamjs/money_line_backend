import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  createAccountValidation,
  deleteAccountByIdValidation,
  updateAccountValidation,
} from '../validator/accounts-validation.js';
import { accountController } from '../controllers/accounts.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/admin', accountController.getAdminsAccounts);

router
  .route('/')
  .get(accountController.getAll)
  .post(createAccountValidation, accountController.create);

router.get('/user', accountController.getById);

router
  .route('/:id')
  .patch(updateAccountValidation, accountController.update)
  .delete(deleteAccountByIdValidation, accountController.delete);

export const AccountsRoutes = router;
