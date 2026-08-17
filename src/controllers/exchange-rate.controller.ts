import type { Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { exchangeRateService } from '../services/exchange-rate.service.js';
import type {
  GetPairCurrencyInput,
  UpdateExchangeRateInput,
} from '../types/exchange-rate.js';

export const exchangeRateController = {
  create: expressAsyncHandler(async (req: Request, res: Response) => {
    const exchangeRate = await exchangeRateService.create(req.body);

    res.status(201).json(exchangeRate);
  }),

  getAll: expressAsyncHandler(async (req: Request, res: Response) => {
    const exchangeRates = await exchangeRateService.getAll();

    res.status(200).json(exchangeRates);
  }),

  getCurrencyPair: expressAsyncHandler(
    async (req: Request<{}, {}, {}, GetPairCurrencyInput>, res: Response) => {
      const exchangeRate = await exchangeRateService.getByCurrencyPair(
        req.query,
      );

      res.status(200).json(exchangeRate);
    },
  ),

  getById: expressAsyncHandler(
    async (req: Request<{ id: string }, {}, {}, {}>, res: Response) => {
      const exchangeRate = await exchangeRateService.getById(req.params.id);

      res.status(200).json(exchangeRate);
    },
  ),

  update: expressAsyncHandler(
    async (
      req: Request<{ id: string }, {}, UpdateExchangeRateInput, {}>,
      res: Response,
    ) => {
      const exchangeRate = await exchangeRateService.update({
        ...req.body,
        id: req.params.id,
      });

      res.status(200).json(exchangeRate);
    },
  ),

  delete: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const exchangeRate = await exchangeRateService.delete(req.params.id);

      res.status(200).json(exchangeRate);
    },
  ),
};
