import { eq } from 'drizzle-orm';
import { usersTable } from '../../db/schema.js';
import { db } from '../config/db.js';

export const authRepository = {
  updatePassword: async (id, { password }) => {
    const user = await db
      .update(usersTable)
      .set({
        password,
      })
      .where(eq(usersTable.id, id))
      .returning();

    return user[0] ?? null;
  },

  updateRefreshToken: async (id, { refreshToken }) => {
    const [user] = await db
      .update(usersTable)
      .set({ refreshToken })
      .returning();

    return user ?? null;
  },
};
