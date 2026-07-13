import 'dotenv/config';
import jwt from 'jsonwebtoken';

export const genTokens = ({ email, role, id }) => {
  const accessToken = jwt.sign(
    { email, role: role, userId: id },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRESIN,
    },
  );

  const refreshToken = jwt.sign(
    { email, role: role, userId: id },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRESIN,
    },
  );

  return {
    accessToken,
    refreshToken,
  };
};
