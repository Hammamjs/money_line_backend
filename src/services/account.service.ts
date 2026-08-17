import { Errors } from '../errors/map-errors.js';
import { accountsRepository } from '../repository/accounts.repository.js';
import { usersRepository } from '../repository/users.repository.js';
import type {
  CreateAccountInput,
  UpdateAccountInput,
} from '../types/account.js';
import {
  decryptedAccount,
  decryptedAccounts,
} from '../utils/decrypte-account.js';
import { cipher, decipher } from '../utils/encryption.js';
import { hash } from '../utils/hash.js';

export const accountService = {
  create: async ({
    userId,
    accountNumber,
    iban,
    phone,
    bankName,
    label,
    extraInfo,
    type,
  }: CreateAccountInput) => {
    if (!userId) throw Errors.badRequest('User id is required');
    const data = {
      accountNumber,
      iban,
      phone,
      bankName,
      label,
      extraInfo,
      type,
    };

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
      phone: cipher(phone),
      label,
      extraInfo,
      accountNumberHash,
      ibanHash,
      bankName,
      userId,
      type,
    });

    return account;
  },

  update: async (
    id: string,
    { accountNumber, bankName, iban, isActive, phone }: UpdateAccountInput,
  ) => {
    if (!id) throw Errors.badRequest('Account id is required');

    const account = await accountsRepository.getById(id);

    if (!account) throw Errors.notFound('Accoutn with this id not found');

    const updateData: UpdateAccountInput = {
      ...(phone !== undefined && { phone: cipher(phone) }),
      ...(iban !== undefined && { iban: cipher(iban) }),
      ...(accountNumber !== undefined && {
        accountNumber: cipher(accountNumber),
      }),
      ...(isActive !== undefined && { isActive }),
      ...(bankName !== undefined && { bankName }),
    };

    const updatedAccount = await accountsRepository.update(id, updateData);

    return { account: updatedAccount };
  },

  getAll: async (userId: string) => {
    if (!userId) throw Errors.badRequest('User id is required');
    const accounts = await accountsRepository.getAll(userId);

    return decryptedAccounts(accounts);
  },

  getAdminsAccounts: async () => {
    const accounts = await usersRepository.getUserWithAccount();

    const decryptedFields = accounts.map((admin) => ({
      ...admin,
      accounts: admin.accounts.map((account) => ({
        ...account,
        accountNumber: decipher(account.accountNumber),
        iban: account.iban ? decipher(account.iban) : null,
        phone: account.phone ? decipher(account.phone) : null,
      })),
    }));

    return { accounts: decryptedFields };
  },

  getById: async (userId: string) => {
    if (!userId) throw Errors.badRequest('user Id is required');

    const accounts = await accountsRepository.getByUserId(userId);

    return {
      accounts: accounts.length === 0 ? [] : decryptedAccounts(accounts),
    };
  },

  delete: async (id: string) => {
    if (!id) throw Errors.badRequest('Id is required');

    const account = await accountsRepository.delete(id);

    if (!account) throw Errors.badRequest('Account not found');

    return account;
  },
};
