import { usersController } from '../controllers/users.controller.js';
import { Router } from 'express';
import {
  deleteUserValidation,
  getByIdValidation,
  updateRoleValidation,
  updateUserValidation,
} from '../validator/users-validation.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { restrictedTo } from '../middleware/restricted-to.middleware.js';
import { Role } from '../constants/role.js';

const router = Router();

router.get('/', usersController.findAll);

router.patch(
  '/update/role',
  authMiddleware,
  restrictedTo(Role.SUPERADMIN),
  updateRoleValidation,
  usersController.updateRole,
);

router
  .route('/:id')
  .get(getByIdValidation, usersController.findById)
  .patch(updateUserValidation, usersController.update)
  .delete(deleteUserValidation, authMiddleware, usersController.delete);

export const UserRoutes = router;
