import expressAsyncHandler from 'express-async-handler';
import { authService } from '../services/auth.service.js';
import { cookieHelper } from '../utils/cookie.herlper.js';

export const authController = {
  signIn: expressAsyncHandler(async (req, res) => {
    const { user, refreshToken, accessToken } = await authService.singIn(
      req.body,
    );

    cookieHelper(res, refreshToken);

    return res.status(200).json({ user, accessToken });
  }),

  signup: expressAsyncHandler(async (req, res) => {
    const { user, refreshToken, accessToken } = await authService.signup(
      req.body,
    );

    cookieHelper(res, refreshToken);

    return res.status(200).json({ user, accessToken });
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
