import type { Response, Request } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { notificationsService } from '../services/notifications.service.js';
import type { CreateNotificationInput } from '../types/notification.js';

export const notificationsController = {
  create: expressAsyncHandler(async (req: Request, res: Response) => {
    const notification = await notificationsService.create(req.body);

    res.status(201).json(notification);
  }),

  updateAll: expressAsyncHandler(async (req: Request, res: Response) => {
    const notification = await notificationsService.update(req.User.id);

    res.status(200).json(notification);
  }),

  updateOne: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const notification = await notificationsService.updateOne(req.params.id);

      res.status(200).json(notification);
    },
  ),

  notify: expressAsyncHandler(async (req: Request, res: Response) => {
    const notify = await notificationsService.notifyUsers(req.body);

    res.status(200).json({ message: 'All users notified' });
  }),
  delete: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const notification = await notificationsService.delete(req.params.id);

      res.status(200).json(notification);
    },
  ),

  getById: expressAsyncHandler(async (req: Request, res: Response) => {
    const notification = await notificationsService.getById(req.User.id);

    res.status(200).json(notification);
  }),

  getByUserId: expressAsyncHandler(async (req: Request, res: Response) => {
    const notifications = await notificationsService.getByUserId(req.User.id);

    res.status(200).json(notifications);
  }),
};
