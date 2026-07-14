import expressAsyncHandler from 'express-async-handler';
import { exchangeRateService } from '../services/exchange-rate.service.js';

export const exchangeRateController = {
  create: expressAsyncHandler(async (req, res) => {
    const exchangeRate = await exchangeRateService.create(req.body);

    return res.status(201).json(exchangeRate);
  }),

  getAll: expressAsyncHandler(async (req, res) => {
    const exchangeRates = await exchangeRateService.getAll();

    return res.status(200).json(exchangeRates);
  }),

  getById: expressAsyncHandler(async (req, res) => {
    const exchangeRate = await exchangeRateService.getById(req.params.id);

    return res.status(200).json(exchangeRate);
  }),

  update: expressAsyncHandler(async (req, res) => {
    const exchangeRate = await exchangeRateService.update(
      req.params.id,
      req.body,
    );

    return res.status(200).json(exchangeRate);
  }),

  delete: expressAsyncHandler(async (req, res) => {
    const exchangeRate = await exchangeRateService.delete(req.params.id);

    return res.status(200).json(exchangeRate);
  }),
};
