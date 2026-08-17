export type CreateOrderInput = {
  userId: string;
  phone: string;
  amount: string;
  accountHolderName: string;
  paymentProvider: string;
  mimetype?: string;
  buffer: Buffer;
  fromAssetId: string;
  toAssetId: string;
  transactorId: string;
  note: string | null;
};

export type CreateOrderRecord = {
  userId: string;
  phone: string;
  accountHolderName: string;
  paymentProvider: string;
  transactionProof: string;
  fromCurrencyId: string;
  toCurrencyId: string;
  note: string | null;
  amount: string;
  transactorId: string;
};

export type UpdateOrderInput = {
  phone?: string;
  accountHolderName?: string;
  paymentProvider?: string;
  mimetype?: string;
  buffer?: Buffer;
};

export type OrderSatatusInput = 'pending' | 'success';
