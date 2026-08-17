import 'dotenv/config';

import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { db } from './db.js';
import { usersTable } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

const { CLIENT_ID, CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

passport.use(
  new Strategy(
    {
      clientID: CLIENT_ID!,
      clientSecret: CLIENT_SECRET!,
      callbackURL:
        GOOGLE_CALLBACK_URL ||
        'http://localhost:3000/api/auth/sign-in/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.googleId, profile.id));

        if (user) return done(null, user);

        const email = profile.emails?.[0]?.value;

        if (!email)
          return done(
            new Error('Google account does not have an email address'),
          );

        [user] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, email));

        if (user) {
          // Update existing user with googleId
          [user] = await db
            .update(usersTable)
            .set({ googleId: profile.id, updatedAt: new Date() })
            .where(eq(usersTable.id, user.id))
            .returning();
        } else {
          // Create new user
          [user] = await db
            .insert(usersTable)
            .values({
              googleId: profile.id,
              email,
              username: profile.displayName,
              role: 'user',
            })
            .returning();
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    },
  ),
);

// Required for Passport to attach the user object to req.user properly
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
