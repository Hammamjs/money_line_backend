import type { Account } from '../types/account.js';
import { decipher } from './encryption.js';

export const decryptedAccount = (account: Account) => ({
  ...account,
  phone: decipher(account.phone),
  iban: decipher(account.iban),
  accountNumber: decipher(account.accountNumber),
});

export const decryptedAccounts = (accounts: Account[]) => {
  const decipherAccounts = accounts.map((account: Account) =>
    decryptedAccount(account),
  );

  return decipherAccounts;
};
