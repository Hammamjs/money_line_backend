import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { accountService } from '../services/account.service.js';
import type { UpdateAccountInput } from '../types/account.js';

export const accountController = {
  create: expressAsyncHandler(async (req: Request, res: Response) => {
    const account = await accountService.create({
      userId: req.User.id,
      ...req.body,
    });

    res.status(200).json(account);
  }),

  update: expressAsyncHandler(
    async (req: Request<{ id: string }, UpdateAccountInput>, res: Response) => {
      const account = await accountService.update(req.params.id, req.body);

      res.status(200).json(account);
    },
  ),

  getAdminsAccounts: expressAsyncHandler(
    async (req: Request, res: Response) => {
      const { accounts } = await accountService.getAdminsAccounts();

      res.status(200).json(accounts);
    },
  ),

  getAll: expressAsyncHandler(async (req: Request, res: Response) => {
    const account = await accountService.getAll(req.User.id);

    res.status(200).json(account);
  }),

  getById: expressAsyncHandler(async (req: Request, res: Response) => {
    const accounts = await accountService.getById(req.User.id);

    res.status(200).json(accounts);
  }),

  delete: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const account = await accountService.delete(req.params.id);

      res.status(200).json(account);
    },
  ),
};
