import { Errors } from '../errors/map.errors.js';
import { exchangeRateRepository } from '../repository/exchange-rate.repoitory.js';
import { currencyRepository } from '../repository/currency.repository.js';

export const exchangeRateService = {
  getById: async (id) => {
    if (!id) throw Errors.badRequest('Id not provided');

    const exchangeRate = await exchangeRateRepository.getById(id);

    if (!exchangeRate)
      throw Errors.notFound(`Exchange with this id ${id} not found`);

    return exchangeRate;
  },

  getAll: async () => {
    return exchangeRateRepository.getAll();
  },

  create: async ({ fromCurrencyId, toCurrencyId, rate }) => {
    if (!fromCurrencyId || !toCurrencyId || rate == null)
      throw Errors.badRequest('Missing required field');

    if (rate <= 0) throw new Errors.badRequest('Rate must be greater than 0');

    if (fromCurrencyId === toCurrencyId) {
      throw Errors.badRequest(
        'Source and destination currencies must be different',
      );
    }

    const existingPair = await exchangeRateRepository.getByCurrencyPair({
      fromCurrencyId,
      toCurrencyId,
    });

    if (existingPair) throw Errors.conflict('Currency exchange already exists');

    const [fromCurrency, toCurrency] = await Promise.all([
      currencyRepository.getById(fromCurrencyId),
      currencyRepository.getById(toCurrencyId),
    ]);

    if (!fromCurrency || !toCurrency)
      throw Errors.notFound('Currency not found');

    if (fromCurrencyId === toCurrencyId)
      throw Errors.badRequest(
        'Source and destination currencies must be different',
      );

    const exchangeRate = await exchangeRateRepository.create({
      fromCurrencyId,
      toCurrencyId,
      rate,
    });

    if (!exchangeRate) throw Errors.internal('Failed to create');

    return exchangeRate;
  },

  update: async (id, { rate }) => {
    if (!id) throw Errors.badRequest('Missing id');
    if (rate === null || rate <= 0) throw Errors('Rate is required');

    const exchangeRate = await exchangeRateRepository.getById(id);

    if (!exchangeRate) throw Errors.notFound('Exchange rate not found');

    const updatedExchangeRate = await exchangeRateRepository.update(id, {
      rate,
    });

    if (!updatedExchangeRate) throw Errors.internal('Failed to update');

    return {
      exchangeRate: updatedExchangeRate,
    };
  },

  delete: async (id) => {
    if (!id) throw Errors.badRequest('Id is required');

    const exchangeRate = await exchangeRateRepository.delete(id);

    if (!exchangeRate)
      throw Errors.notFound(`Exchange with this id: ${id} not found`);

    return exchangeRate;
  },
};
