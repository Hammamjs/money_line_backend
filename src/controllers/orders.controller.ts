import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { ordersService } from '../services/orders.service.js';
import type { OrderSatatusInput, UpdateOrderInput } from '../types/orders.js';

export const ordersController = {
  create: expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await ordersService.create({
      ...req.body,
      buffer: req.file?.buffer,
      mimetype: req.file?.mimetype,
      userId: req.User.id,
    });

    res.status(201).json(order);
  }),

  update: expressAsyncHandler(
    async (
      req: Request<{ id: string }, {}, UpdateOrderInput>,
      res: Response,
    ) => {
      const order = await ordersService.update(req.params.id, req.body);

      res.status(200).json(order);
    },
  ),

  updateStatus: expressAsyncHandler(
    async (
      req: Request<{ id: string }, {}, { status: OrderSatatusInput }>,
      res: Response,
    ) => {
      const order = await ordersService.updateStatus(
        req.params.id,
        req.User.id,
        req.body,
      );

      res.status(200).json(order);
    },
  ),

  getById: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const order = await ordersService.getById(req.params.id);

      res.status(200).json(order);
    },
  ),

  getAll: expressAsyncHandler(async (req: Request, res: Response) => {
    console.log('AUTH USER:', req.User);
    console.log('TRANSactor ID:', req.User.id);
    const order = await ordersService.getAll({
      ...req.query,
      transactorId: req.User.id,
    });

    console.log(order);

    res.status(200).json(order);
  }),

  getByUserId: expressAsyncHandler(async (req: Request, res: Response) => {
    const order = await ordersService.getByUserId(req.User.id);

    res.status(200).json(order);
  }),

  delete: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const order = await ordersService.delete(req.params.id);

      res.status(200).json(order);
    },
  ),
};
