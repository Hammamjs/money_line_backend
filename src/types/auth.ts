import type { Roles, User } from './users.js';

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = Omit<
  User,
  'createdAt' | 'updatedAt' | 'refreshToken' | 'role' | 'id'
>;

export type updatePasswordInput = {
  userId: string;
  newPassword: string;
  currentPassword: string;
};

export type LogoutInput = {
  refreshToken: string;
  user: Pick<User, 'id' | 'email' | 'role'>;
};

export type VerifyResetCode = {
  email: string;
  resetCode: string;
};

export type ResetCodeInput = {
  email: string;
  newPassword: string;
};

export type JWTPaylaods = {
  role: Roles;
  id: string;
  email: string;
};
