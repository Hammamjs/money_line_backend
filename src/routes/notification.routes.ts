import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { Role } from '../constants/role.js';
import {
  createNotificaionValidation,
  deleteNotificationValidation,
  getNotificationByIdValidation,
  notifyUsersValidation,
  updateOneNotificationValidation,
} from '../validator/notifications-validation.js';
import { notificationsController } from '../controllers/notifications.controller.js';
import { restrictedTo } from '../middleware/restricted-to.middleware.js';

const router = Router();

router.use(authMiddleware);

router
  .route('/')
  .post(createNotificaionValidation, notificationsController.create)
  .patch(notificationsController.updateAll);
router.route('/user').get(notificationsController.getByUserId);

router
  .route('/:id')
  .get(getNotificationByIdValidation, notificationsController.getById)
  .delete(deleteNotificationValidation, notificationsController.delete)
  .patch(updateOneNotificationValidation, notificationsController.updateOne);

router.post(
  '/notify/users',
  restrictedTo(Role.ADMIN),
  notifyUsersValidation,
  notificationsController.notify,
);

export const NotificationsRoutes = router;
