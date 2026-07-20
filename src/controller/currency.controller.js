import expressAsyncHandler from 'express-async-handler';
import { currencyService } from '../services/currency.service.js';

export const currencyController = {
  create: expressAsyncHandler(async (req, res) => {
    const currency = await currencyService.create(req.body);

    return res.status(201).json(currency);
  }),

  update: expressAsyncHandler(async (req, res) => {
    const currency = await currencyService.update(req.params.id, req.body);

    return res.status(200).json(currency);
  }),

  getById: expressAsyncHandler(async (req, res) => {
    const currency = await currencyService.getById(req.params.id);

    return res.status(200).json(currency);
  }),

  getAll: expressAsyncHandler(async (req, res) => {
    const currencies = await currencyService.getAll(req.params.id);

    return res.status(200).json(currencies);
  }),

  delete: expressAsyncHandler(async (req, res) => {
    const currency = await currencyService.delete(req.params.id);

    return res.status(200).json(currency);
  }),
};
