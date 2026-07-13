export const sanitizeUser = (user) => {
  const { password, refreshToken, ...safeUser } = user;

  return safeUser;
};
