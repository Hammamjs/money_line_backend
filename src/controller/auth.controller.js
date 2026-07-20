import expressAsyncHandler from 'express-async-handler';
import { authService } from '../services/auth.service.js';
import { setCookie, removeCookie } from '../utils/cookie.herlper.js';

export const authController = {
  signIn: expressAsyncHandler(async (req, res) => {
    const { user, refreshToken, accessToken } = await authService.singIn(
      req.body,
    );

    setCookie(res, refreshToken);

    return res.status(200).json({ user, accessToken });
  }),

  signup: expressAsyncHandler(async (req, res) => {
    const { user, refreshToken, accessToken } = await authService.signup(
      req.body,
    );

    setCookie(res, refreshToken);

    return res.status(200).json({ user, accessToken });
  }),

  handleRefreshToken: expressAsyncHandler(async (req, res) => {
    const { accessToken, refreshToken, user } =
      await authService.handleRefreshToken({
        refreshToken: req.cookies.refreshToken,
      });

    setCookie(res, refreshToken);

    return res.status(200).json({ accessToken, user });
  }),

  logOut: expressAsyncHandler(async (req, res) => {
    try {
      await authService.logOut({
        refreshToken: req.cookies.refreshToken,
        user: req.user,
      });
    } finally {
      removeCookie(res);
    }

    return res.status(200).json({ message: 'You logged out' });
  }),

  forgetPassword: expressAsyncHandler(async (req, res) => {
    const message = await authService.forgetPassword(req.body);

    return res.status(200).json(message);
  }),

  verifyResetCode: expressAsyncHandler(async (req, res) => {
    const message = await authService.verifyResetCode(req.body);

    return res.status(200).json(message);
  }),

  resetPassword: expressAsyncHandler(async (req, res) => {
    const message = await authService.resetPassword(req.body);

    return res.status(200).json(message);
  }),
};
