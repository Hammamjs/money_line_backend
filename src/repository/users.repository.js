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

  update: async ({ username, phone, id }) => {
    const user = await db
      .update(usersTable)
      .set({
        username,
        phone,
      })
      .where(eq(usersTable.id, id))
      .returning();

    return user[0] ?? null;
  },

  getAll: async () => {
    return db.select().from(usersTable);
  },

  delete: async (id) => {
    const user = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    return user[0] ?? null;
  },
};
