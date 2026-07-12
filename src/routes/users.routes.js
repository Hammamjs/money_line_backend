import { usersController } from '../controller/users.controller.js';
import { Router } from 'express';
import {
  createUserValidation,
  deleteUserValidation,
  getByIdValidation,
  updateUserValidation,
} from '../utils/validation/users.validation.js';

const router = Router();

router
  .route('/')
  .get(usersController.findAll)
  .post(createUserValidation, usersController.create);

router
  .route('/:id')
  .get(getByIdValidation, usersController.findById)
  .patch(updateUserValidation, usersController.update)
  .delete(deleteUserValidation, usersController.delete);

export const UserRoutes = router;
