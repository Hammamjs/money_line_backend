import expressAsyncHandler from 'express-async-handler';
import { accountService } from '../services/account.service.js';

export const accountController = {
  create: expressAsyncHandler(async (req, res) => {
    const account = await accountService.create({
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json(account);
  }),

  update: expressAsyncHandler(async (req, res) => {
    const account = await accountService.update(req.params.id, req.body);

    return res.status(200).json(account);
  }),

  getAll: expressAsyncHandler(async (req, res) => {
    const account = await accountService.getAll(req.user.userId);

    return res.status(200).json(account);
  }),

  getById: expressAsyncHandler(async (req, res) => {
    const account = await accountService.getById(req.params.id);

    return res.status(200).json(account);
  }),

  delete: expressAsyncHandler(async (req, res) => {
    const account = await accountService.delete(req.params.id);

    return res.status(200).json(account);
  }),
};
