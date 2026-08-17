import type { Response, Request } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { currencyService } from '../services/currency.service.js';
import type {
  CreateCurrencyInput,
  UpdateCurrencyInput,
} from '../types/currency.js';
export const currencyController = {
  create: expressAsyncHandler(
    async (req: Request<{}, CreateCurrencyInput>, res: Response) => {
      const currency = await currencyService.create(req.body);

      res.status(201).json(currency);
    },
  ),

  update: expressAsyncHandler(
    async (
      req: Request<{ id: string }, UpdateCurrencyInput>,
      res: Response,
    ) => {
      const currency = await currencyService.update(req.params.id, req.body);

      res.status(200).json(currency);
    },
  ),

  getById: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const currency = await currencyService.getById(req.params.id);

      res.status(200).json(currency);
    },
  ),

  getAll: expressAsyncHandler(async (req: Request, res: Response) => {
    const currencies = await currencyService.getAll();

    res.status(200).json(currencies);
  }),

  delete: expressAsyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const currency = await currencyService.delete(req.params.id);

      res.status(200).json(currency);
    },
  ),
};
