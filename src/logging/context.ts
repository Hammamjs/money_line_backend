import { AsyncLocalStorage } from 'async_hooks';

interface RequestStore {
  requestId: string;
  userId?: string | undefined;
  ip?: string | undefined;
}

export const requestContext = new AsyncLocalStorage<RequestStore>();
