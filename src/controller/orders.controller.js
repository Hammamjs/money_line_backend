import expressAsyncHandler from 'express-async-handler';
import { ordersService } from '../services/orders.service.js';

export const ordersController = {
  create: expressAsyncHandler(async (req, res) => {
    const order = await ordersService.create({
      ...req.body,
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      userId: req.user.id,
    });

    return res.status(201).json(order);
  }),

  update: expressAsyncHandler(async (req, res) => {
    const order = await ordersService.update(req.params.id, req.body);

    return res.status(200).json(order);
  }),

  updateStatus: expressAsyncHandler(async (req, res) => {
    const order = await ordersService.updateStatus(req.params.id, req.body);

    return res.status(200).json(order);
  }),

  getById: expressAsyncHandler(async (req, res) => {
    console.log(req.params);
    const order = await ordersService.getById(req.params);

    return res.status(200).json(order);
  }),

  getAll: expressAsyncHandler(async (req, res) => {
    const order = await ordersService.getAll(req.query);

    return res.status(200).json(order);
  }),

  getByUserId: expressAsyncHandler(async (req, res) => {
    const order = await ordersService.getByUserId(req.params);

    return res.status(200).json(order);
  }),
  delete: expressAsyncHandler(async (req, res) => {
    const order = await ordersService.delete(req.params);

    return res.status(200).json(order);
  }),
};
