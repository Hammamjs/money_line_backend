export type CreateExchangeRateInput = {
  fromId: string;
  toId: string;
  rate: string;
};

export type UpdateExchangeRateInput = {
  id: string;
  rate?: string;
  isActive?: boolean;
};

export type GetPairCurrencyInput = {
  fromId: string;
  toId: string;
};
