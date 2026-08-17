import { appEvent } from '../events/app-events.js';
import { EVENTS } from '../events/app-events-name.js';
import type { User } from '../types/users.js';
import { sendEmail } from '../utils/send-email.js';

export const registerSendResetPasswordCode = appEvent.on(
  EVENTS.FORGET_PASSWORD,
  async ({ user, resetCode }: { user: User; resetCode: string }) => {
    try {
      await sendEmail(user, resetCode);
    } catch (err) {
      console.log('Failed ', err);
    }
  },
);
