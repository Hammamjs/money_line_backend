import { currencyRepository } from '../repository/currency.repository.js';
import { Errors } from '../errors/map-errors.js';
import type {
  CreateCurrencyInput,
  UpdateCurrencyInput,
} from '../types/currency.js';
import { isPostgresError } from '../errors/postgres-error.js';

export const currencyService = {
  create: async ({ name, code, symbol, flag }: CreateCurrencyInput) => {
    if (!name || !code || !symbol || !flag)
      throw Errors.badRequest('Missing required fields');

    try {
      const currency = await currencyRepository.create({
        name,
        code,
        symbol,
        flag,
      });

      return currency;
    } catch (err: unknown) {
      if (isPostgresError(err)) {
        if (err?.code === '23505') {
          if (err.constraint === 'currencies_name_unique') {
            throw Errors.conflict('Currency name already exists');
          }

          if (err.constraint === 'currencies_code_unique') {
            throw Errors.conflict('Currency code already exists');
          }

          throw Errors.conflict('Currency already exists');
        }
      }

      throw err;
    }
  },

  update: async (
    id: string,
    { name, code, symbol, isActive, flag }: UpdateCurrencyInput,
  ) => {
    if (!id) throw Errors.badRequest('Id not provided');

    const updateData: UpdateCurrencyInput = {
      ...(name !== undefined && { name }),
      ...(code !== undefined && { code }),
      ...(symbol !== undefined && { symbol }),
      ...(isActive !== undefined && { isActive }),
      ...(flag !== undefined && { flag }),
    };

    const updatedCurrency = await currencyRepository.update(id, updateData);

    return updatedCurrency;
  },

  getAll: async () => {
    return currencyRepository.getAll();
  },

  getById: async (id: string) => {
    if (!id) throw Errors.badRequest('Id not provided');

    const currency = await currencyRepository.getById(id);

    if (!currency)
      throw Errors.notFound(`Currency wiht this id ${id} not found`);

    return currency;
  },

  delete: async (id: string) => {
    if (!id) throw Errors.badRequest('Id not provided');

    const deleteCurrency = await currencyRepository.delete(id);

    if (!deleteCurrency) throw Errors.notFound('Failed to delete currency');

    return deleteCurrency;
  },
};
