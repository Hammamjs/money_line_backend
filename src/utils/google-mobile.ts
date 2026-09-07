import { OAuth2Client } from 'google-auth-library';

export const client = new OAuth2Client();

export const verifyGoogleIdToken = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID!,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email)
    throw new Error('Invalid google identity');

  return {
    id: payload.sub,
    email: payload.email,
    username: payload.name ?? payload.email.split('@')[0] ?? 'unknown user',
  };
};
