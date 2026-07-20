import { db } from '../config/db.js';
import { usersTable } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

export const usersRepository = {
  getByEmail: async (email) => {
    const res = await db.query.usersTable.findFirst({ where: { email } });

    return res ?? null;
  },

  create: async ({ email, username, password }) => {
    const res = await db
      .insert(usersTable)
      .values({
        email,
        password,
        username,
      })
      .returning();

    return res[0] ?? null;
  },

  getById: async (id) => {
    return db.query.usersTable.findFirst({ where: { id } });
  },

  update: async (id, data) => {
    const user = await db
      .update(usersTable)
      .set(data)
      .where(eq(usersTable.id, id))
      .returning();

    return user[0] ?? null;
  },

  getAll: async () => {
    return db.query.usersTable.findMany();
  },

  delete: async (id) => {
    const user = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    return user[0] ?? null;
  },
};
