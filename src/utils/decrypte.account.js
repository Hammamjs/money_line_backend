import { decipher } from './enryption.js';

export const decryptedAccount = (account) => ({
  ...account,
  phoneNumber: decipher(account.phoneNumber),
  iban: decipher(account.iban),
  accountNumber: decipher(account.accountNumber),
});

export const decryptedAccounts = (accounts) => {
  const decipherAccounts = accounts.map((account) => decryptedAccount(account));

  return decipherAccounts;
};
