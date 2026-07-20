import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { Role } from '../constant/role.js';
import {
  createNotificaionValidation,
  deleteNotificationValidation,
  getNotificationByIdValidation,
  getNotificationByUserIdValidation,
  updateNotificationValidation,
} from '../validator/notifications.validation.js';
import { notificationsController } from '../controller/notifications.controller.js';

const router = Router();

router.use(authMiddleware);

router.get('/', createNotificaionValidation, notificationsController.create);

router
  .route('/:id')
  .get(getNotificationByIdValidation, notificationsController.getById)
  .patch(updateNotificationValidation, notificationsController.update)
  .delete(deleteNotificationValidation, notificationsController.delete);

router
  .route('/user/:userId')
  .get(getNotificationByUserIdValidation, notificationsController.getByUserId);

export const NotificationsRoutes = router;
