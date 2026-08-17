import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { restrictedTo } from '../middleware/restricted-to.middleware.js';
import { Role } from '../constants/role.js';
import {
  createOrderValidation,
  deleteOrderByIdValidation,
  getOrderByIdValidation,
  updateOrderValidation,
  updateStatusValidation,
} from '../validator/orders-validation.js';
import { ordersController } from '../controllers/orders.controller.js';
import { upload } from '../utils/multer.js';

const router = Router();

router.use(authMiddleware);

router
  .route('/')
  .get(restrictedTo(Role.ADMIN, Role.SUPERADMIN), ordersController.getAll)
  .post(
    restrictedTo(Role.USER),
    upload.single('transactionProof'),
    createOrderValidation,
    ordersController.create,
  );

router.get('/user', restrictedTo(Role.USER), ordersController.getByUserId);

router.patch(
  '/update-status/:id',
  restrictedTo(Role.ADMIN, Role.SUPERADMIN),
  updateStatusValidation,
  ordersController.updateStatus,
);

router
  .route('/:id')
  .get(
    restrictedTo(Role.USER),
    getOrderByIdValidation,
    ordersController.getById,
  )
  .patch(
    restrictedTo(Role.USER),
    upload.single('transactionProof'),
    updateOrderValidation,
    ordersController.update,
  )
  .delete(
    restrictedTo(Role.USER),
    deleteOrderByIdValidation,
    ordersController.delete,
  );

export const OrdersRoutes = router;
