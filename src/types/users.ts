export type Roles = 'user' | 'admin' | 'super_admin';

export type FindAllQuery = { role?: Roles };

export type User = {
  id: string;
  password: string;
  username: string;
  refreshToken?: string[];
  googleId?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: Roles;
};
