import 'dotenv/config';
import { createTransport } from 'nodemailer';
import { HTMLTemplate } from './send-template.js';
import type { User } from '../types/users.js';

export const sendEmail = async (user: User, resetCode: string) => {
  const transporter = createTransport({
    service: process.env.SERVICE_PROVIDER,
    auth: {
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Money Line" <money_line@support.com>`,
    to: user.email,
    html: HTMLTemplate(user.username, resetCode),
    subject: 'Your Money Line Reset Code',
  });
};
