export type CreateCurrencyInput = {
  name: string;
  code: string;
  symbol: string;
  flag: string;
};

export type UpdateCurrencyInput = {
  name?: string;
  code?: string;
  symbol?: string;
  isActive?: boolean;
  flag?: string;
};
