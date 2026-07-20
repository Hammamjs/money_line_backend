import { allowedUrls } from './allowed.url.js';

export const corsOption = {
  origin: (origin, cb) => {
    if (!origin || allowedUrls.includes(origin)) {
      return cb(null, true);
    }

    return cb(new Error('Url not allowed'));
  },

  credentials: true,
};
