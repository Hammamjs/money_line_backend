export type AccountType = 'Bank' | 'Wallet';

export type Account = {
  id: string;
  userId: string;
  accountNumber: string;
  iban: string;
  phone: string;
  bankName: string;
  label: string;
  type: AccountType;
  extraInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAccountInput = {
  userId: string;
  accountNumber: string;
  iban: string;
  phone: string;
  bankName: string;
  label: string;
  type: AccountType;
  extraInfo: string | null;
};

export type CreateAccountRecord = {
  userId: string;
  accountNumber: string;
  iban: string;
  phone: string;
  bankName: string;
  ibanHash: string;
  accountNumberHash: string;
  label: string;
  type: AccountType;
  extraInfo: string | null;
  isDefault?: boolean;
};

export type UpdateAccountInput = {
  accountNumber?: string;
  iban?: string;
  phone?: string;
  bankName?: string;
  isActive?: boolean;
};
