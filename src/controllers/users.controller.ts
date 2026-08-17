import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { usersService } from '../services/users.service.js';
import type { Roles } from '../types/users.js';

export const usersController = {
  findAll: expressAsyncHandler(
    async (req: Request<{}, {}, {}, { role?: Roles }>, res: Response) => {
      const users = await usersService.findAll({ role: req.query.role });

      res.status(200).json(users);
    },
  ),

  update: expressAsyncHandler(
    async (
      req: Request<{ id: string }, {}, { username: string }>,
      res: Response,
    ) => {
      const { username } = req.body;
      const { id } = req.params;
      const { user } = await usersService.update(id, { username });

      res.status(200).json({
        message: 'User Data updated',
        user,
      });
    },
  ),

  findById: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const user = await usersService.findById(req.params.id);

      res.status(200).json(user);
    },
  ),

  updateRole: expressAsyncHandler(
    async (
      req: Request<{}, {}, { role: 'user' | 'admin'; id: string }>,
      res: Response,
    ) => {
      const user = await usersService.updateRole(req.body.id, {
        role: req.body.role,
      });

      res.status(200).json(user);
    },
  ),

  delete: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const deletedUser = await usersService.delete(req.params.id);

      res.status(204).json({
        message: 'user deleted succesfully',
      });
    },
  ),
};
