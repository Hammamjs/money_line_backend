import expressAsyncHandler from 'express-async-handler';

import { usersService } from '../services/usersService.js';

export const usersController = {
  create: expressAsyncHandler(async (req, res) => {
    const user = await usersService.create(req.body);

    return res.status(201).json({
      message: 'Account created successfully!',
      user,
    });
  }),

  findAll: expressAsyncHandler(async (req, res) => {
    const users = await usersService.findAll();

    return res.status(200).json(users);
  }),
};
