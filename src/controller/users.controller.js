import expressAsyncHandler from 'express-async-handler';

import { usersService } from '../services/usersService.js';

export const usersController = {
  findAll: expressAsyncHandler(async (req, res) => {
    const users = await usersService.findAll();

    return res.status(200).json(users);
  }),

  update: expressAsyncHandler(async (req, res) => {
    const { username, phone } = req.body;
    const { id } = req.params;
    const user = await usersService.update(id, { username, phone });

    return res.status(200).json({
      message: 'User Data updated',
      user,
    });
  }),

  findById: expressAsyncHandler(async (req, res) => {
    const user = await usersService.findById(req.params.id);

    return res.status(200).json(user);
  }),

  delete: expressAsyncHandler(async (req, res) => {
    const deletedUser = await usersService.delete(req.params.id);

    return res.status(204).json({
      message: 'user deleted succesfully',
    });
  }),
};
