import { db } from '../config/db.js';
import { usersTable } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const usersRepository = {
  getByEmail: async (email) => {
    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    return res[0] ?? null;
  },

  getById: async (id) => {
    const res = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return res[0] ?? null;
  },

  create: async ({ username, email, role, phone }) => {
    return db
      .insert(usersTable)
      .values({
        username,
        email,
        phone,
        role,
      })
      .returning();
  },

  getAll: async () => {
    return db.select().from(usersTable);
  },
};
