import { Errors } from '../errors/map.errors.js';
import { accountsRepository } from '../repository/accounts.repository.js';
import {
  decryptedAccount,
  decryptedAccounts,
} from '../utils/decrypte.account.js';
import { cipher, decipher } from '../utils/enryption.js';
import { hash } from '../utils/hash.js';

export const accountService = {
  create: async ({ userId, accountNumber, iban, phoneNumber, bankName }) => {
    if (!userId) throw Errors.badRequest('User id is required');
    const data = { accountNumber, iban, phoneNumber, bankName };

    const missing = Object.entries(data)
      .filter(([_, v]) => v === undefined)
      .map(([k]) => k);

    if (missing.length > 0)
      throw Errors.badRequest(`Missing fileds ${missing.join(', ')}`);

    const accountNumberHash = hash(accountNumber);
    const ibanHash = hash(iban);

    const exists = await accountsRepository.exists({
      ibanHash,
      accountNumberHash,
    });

    if (exists) throw Errors.conflict('IBAN or account number already exists');

    const account = await accountsRepository.create({
      accountNumber: cipher(accountNumber),
      iban: cipher(iban),
      phoneNumber: cipher(phoneNumber),
      accountNumberHash,
      ibanHash,
      bankName,
      userId,
    });

    return account;
  },

  update: async (id, { accountNumber, iban, phoneNumber, bankName }) => {
    if (!id) throw Errors.badRequest('Account id is required');

    const account = await accountsRepository.getById(id);

    if (!account) throw Errors.notFound('Accoutn with this id not found');

    const data = { accountNumber, iban, phoneNumber, bankName };

    const filterData = Object.fromEntries(
      Object.entries(data)
        .filter(([_, v]) => v !== undefined)
        .map(([k, v]) => [k, k !== 'bankName' ? cipher(v) : v]),
    );

    if (filterData.iban) filterData.ibanHash = hash(iban);
    if (filterData.accountNumber) filterData.ibanHash = hash(accountNumber);

    const updatedAccount = await accountsRepository.update(id, filterData);

    return { account: updatedAccount };
  },

  getAll: async (userId) => {
    if (!userId) throw Errors.badRequest('User id is required');
    const accounts = await accountsRepository.getAll(userId);

    return decryptedAccounts(accounts);
  },

  getById: async (id) => {
    if (!id) throw Errors.badRequest('Id is required');
    const account = await accountsRepository.getById(id);

    if (!account) throw Errors.notFound('Account not exists');

    return {
      account: decryptedAccount(account),
    };
  },

  delete: async (id) => {
    if (!id) throw Errors.badRequest('Id is required');

    const account = await accountsRepository.delete(id);

    if (!account) throw Errors.badRequest('Account not found');

    return account;
  },
};
