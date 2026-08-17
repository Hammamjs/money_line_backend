import { Errors } from '../errors/map-errors.js';
import { exchangeRateRepository } from '../repository/exchange-rate.repository.js';
import { currencyRepository } from '../repository/currency.repository.js';

import type {
  CreateExchangeRateInput,
  GetPairCurrencyInput,
  UpdateExchangeRateInput,
} from '../types/exchange-rate.js';

export const exchangeRateService = {
  getById: async (id: string) => {
    if (!id) throw Errors.badRequest('Id not provided');

    const exchangeRate = await exchangeRateRepository.getById(id);

    if (!exchangeRate)
      throw Errors.notFound(`Exchange with this id ${id} not found`);

    return exchangeRate;
  },

  getAll: async () => {
    return exchangeRateRepository.getAll();
  },

  getByCurrencyPair: async ({ fromId, toId }: GetPairCurrencyInput) => {
    if (!fromId || !toId)
      throw Errors.badRequest('from and to currency id is required');

    const exchangeRate = await exchangeRateRepository.getByCurrencyPair({
      fromId,
      toId,
    });

    if (!exchangeRate) throw Errors.notFound('exchange rate not found');

    return exchangeRate;
  },

  create: async ({ fromId, toId, rate }: CreateExchangeRateInput) => {
    if (!fromId || !toId || rate == null)
      throw Errors.badRequest('Missing required field');

    if (+rate <= 0) throw Errors.badRequest('Rate must be greater than 0');

    if (fromId === toId) {
      throw Errors.badRequest(
        'Source and destination currencies must be different',
      );
    }

    const existingPair = await exchangeRateRepository.getByCurrencyPair({
      fromId,
      toId,
    });

    if (existingPair) throw Errors.conflict('Currency exchange already exists');

    const [fromCurrency, toCurrency] = await Promise.all([
      currencyRepository.getById(fromId),
      currencyRepository.getById(toId),
    ]);

    if (!fromCurrency || !toCurrency)
      throw Errors.notFound('Currency not found');

    if (fromId === toId)
      throw Errors.badRequest(
        'Source and destination currencies must be different',
      );

    const exchangeRate = await exchangeRateRepository.create({
      fromId,
      toId,
      rate,
    });

    if (!exchangeRate) throw Errors.internal('Failed to create');

    return exchangeRate;
  },

  update: async ({ id, rate, isActive }: UpdateExchangeRateInput) => {
    if (!id) throw Errors.badRequest('Missing id');
    if (rate && +rate <= 0)
      throw Errors.badRequest('Rate must be greater than zero');

    const exchangeRate = await exchangeRateRepository.getById(id);

    if (!exchangeRate) throw Errors.notFound('Exchange rate not found');

    const updateData: UpdateExchangeRateInput = {
      id,
      ...(rate !== undefined && { rate }),
      ...(isActive !== undefined && { isActive }),
    };

    if (rate === undefined && isActive === undefined)
      throw Errors.badRequest('Nothing to update');

    const updatedExchangeRate = await exchangeRateRepository.update(updateData);

    if (!updatedExchangeRate) throw Errors.internal('Failed to update');

    return {
      exchangeRate: updatedExchangeRate,
    };
  },

  delete: async (id: string) => {
    if (!id) throw Errors.badRequest('Id is required');

    const exchangeRate = await exchangeRateRepository.delete(id);

    if (!exchangeRate)
      throw Errors.notFound(`Exchange with this id: ${id} not found`);

    return exchangeRate;
  },
};
