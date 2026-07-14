import { currencyRepository } from '../repository/currency.repository.js';
import { Errors } from '../errors/map.errors.js';

export const currencyService = {
  create: async ({ name, code, symbol }) => {
    if (!name || !code || !symbol)
      throw Errors.badRequest('Missing required fields');

    const currency = await currencyRepository.create({ name, code, symbol });

    return currency;
  },

  update: async (id, { name, code, symbol }) => {
    if (!id) throw Errors.badRequest('Id not provided');

    const data = { name, code, symbol };

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined),
    );

    if (Object.keys(filteredData).length === 0)
      throw Errors.badRequest('Nothing to update');

    const updatedCurrency = await currencyRepository.update(id, filteredData);

    return updatedCurrency;
  },

  getById: async (id) => {
    if (!id) throw Errors.badRequest('Id not provided');

    const currency = await currencyRepository.getById(id);

    if (!currency)
      throw Errors.notFound(`Currency wiht this id ${id} not found`);

    return currency;
  },

  delete: async (id) => {
    if (!id) throw Errors.badRequest('Id not provided');

    const deleteCurrency = await currencyRepository.delete(id);

    if (!deleteCurrency) throw Errors.notFound('Failed to delete currency');

    return deleteCurrency;
  },
};
