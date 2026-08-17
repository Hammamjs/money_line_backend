import { eq } from 'drizzle-orm';
import { usersTable } from '../../db/schema.js';
import { db } from '../config/db.js';

export const authRepository = {
  updatePassword: async (id: string, { password }: { password: string }) => {
    const user = await db
      .update(usersTable)
      .set({
        password,
      })
      .where(eq(usersTable.id, id))
      .returning();

    return user[0] ?? null;
  },

  updateRefreshToken: async (
    id: string,
    { refreshToken }: { refreshToken: string[] },
  ) => {
    const [user] = await db
      .update(usersTable)
      .set({ refreshToken })
      .where(eq(usersTable.id, id))
      .returning();

    return user ?? null;
  },
};
