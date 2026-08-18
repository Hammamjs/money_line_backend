import expressAsyncHandler from 'express-async-handler';
import {
  credentialsService,
  passwordService,
  recoveryService,
} from '@/src/services/auth/index.js';
import { setCookie, removeCookie } from '../utils/cookie-helper.js';
import type { Response, Request, NextFunction } from 'express';
import { Errors } from '../errors/map-errors.js';

export const authController = {
  signIn: expressAsyncHandler(async (req: Request, res: Response) => {
    const { user, refreshToken, accessToken } =
      await credentialsService.authSignIn(req.body);

    setCookie(res, refreshToken);

    res.status(200).json({ user, accessToken });
  }),

  signup: expressAsyncHandler(async (req: Request, res: Response) => {
    const { user, refreshToken, accessToken } =
      await credentialsService.authSignup(req.body);

    setCookie(res, refreshToken);

    res.status(200).json({ user, accessToken });
  }),

  updatePassword: expressAsyncHandler(async (req: Request, res: Response) => {
    const message = await passwordService.updatePassword({
      userId: req.User?.id,
      newPassword: req.body.newPassword,
      currentPassword: req.body.currentPassword,
    });

    res.status(200).json(message);
  }),

  handleRefreshToken: expressAsyncHandler(
    async (req: Request, res: Response) => {
      try {
        const { accessToken, refreshToken, user } =
          await credentialsService.handleRefreshToken({
            refreshToken: req.cookies.refreshToken,
          });

        setCookie(res, refreshToken);

        res.status(200).json({ accessToken, user });
      } catch (err) {
        removeCookie(res);
        throw err;
      }
    },
  ),

  logOut: expressAsyncHandler(async (req: Request, res: Response) => {
    try {
      await credentialsService.logOut({
        refreshToken: req.cookies.refreshToken,
        user: req.User,
      });
    } finally {
      removeCookie(res);
    }

    res.status(200).json({ message: 'You logged out' });
  }),

  forgetPassword: expressAsyncHandler(async (req: Request, res: Response) => {
    const message = await recoveryService.forgetPassword(req.body);

    res.status(200).json(message);
  }),

  verifyResetCode: expressAsyncHandler(async (req: Request, res: Response) => {
    const message = await recoveryService.verifyResetCode(req.body);

    res.status(200).json(message);
  }),

  resetPassword: expressAsyncHandler(async (req: Request, res: Response) => {
    const message = await recoveryService.resetPassword(req.body);

    res.status(200).json(message);
  }),

  googleAuth: expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const passportUser = req.user as any;

        if (!passportUser)
          return res.redirect('/login?error=google_auth_failed');

        const { accessToken, refreshToken, user } =
          await credentialsService.processGoogleService(passportUser);

        console.log(refreshToken);

        setCookie(res, refreshToken);

        const encodedUser = encodeURIComponent(JSON.stringify(user));

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

        if (!frontendUrl) throw Errors.internal('Redirection is missing');

        return res.redirect(
          `${frontendUrl}/auth/callback?accessToken=${accessToken}&user=${encodedUser}`,
        );
      } catch (error) {
        next(error);
      }
    },
  ),
};
