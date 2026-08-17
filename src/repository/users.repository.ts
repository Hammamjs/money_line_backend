import { db } from '../config/db.js';
import { usersTable } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import type { SignUpInput } from '../types/auth.js';
import type { Roles } from '../types/users.js';

export const usersRepository = {
  getByEmail: async (email: string) => {
    const user = await db.query.usersTable.findFirst({ where: { email } });

    return user ?? null;
  },

  create: async ({ email, username, password }: SignUpInput) => {
    const [user] = await db
      .insert(usersTable)
      .values({
        email,
        password,
        username,
      })
      .returning();

    return user ?? null;
  },

  getById: async (id: string) => {
    return db.query.usersTable.findFirst({ where: { id } });
  },

  update: async (id: string, data: { username?: string; role?: Roles }) => {
    const [user] = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();

    return user ?? null;
  },

  getAll: async ({ role }: { role: Roles | undefined }) => {
    return db.query.usersTable.findMany({
      where: { role },
    });
  },

  getUserWithAccount: async () => {
    return db.query.usersTable.findMany({
      where: { role: { in: ['admin', 'super_admin'] } },
      columns: {
        username: true,
        email: true,
      },
      with: {
        accounts: true,
      },
    });
  },

  delete: async (id: string) => {
    const [user] = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    return user ?? null;
  },
};
