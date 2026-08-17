import { allowedUrls } from './allowed-url.js';

export const corsOption = {
  origin: (
    origin: string | undefined,
    cb: (error: Error | null, credentials?: boolean) => void,
  ) => {
    if (!origin || allowedUrls?.includes(origin)) {
      return cb(null, true);
    }

    return cb(new Error('Url not allowed'));
  },

  credentials: true,
};
