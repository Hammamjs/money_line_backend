import expressAsyncHandler from 'express-async-handler';
import { notificationsService } from '../services/notifications.service.js';

export const notificationsController = {
  create: expressAsyncHandler(async (req, res) => {
    const notification = await notificationsService.create(req.body);

    return res.status(201).json(notification);
  }),

  update: expressAsyncHandler(async (req, res) => {
    const notification = await notificationsService.update(req.params.id);

    return res.status(200).json(notification);
  }),

  delete: expressAsyncHandler(async (req, res) => {
    const notification = await notificationsService.update(req.params.id);

    return res.status(200).json(notification);
  }),

  getById: expressAsyncHandler(async (req, res) => {
    const notification = await notificationsService.getById(req.params.id);

    return res.status(200).json(notification);
  }),

  getByUserId: expressAsyncHandler(async (req, res) => {
    const notifications = await notificationsService.getByUserId(
      req.params.userId,
    );

    return res.status(200).json(notifications);
  }),
};
