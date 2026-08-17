import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import {
  resetPasswordValidation,
  signInValidation,
  signupValidation,
  verifyResetCodeValidation,
  forgetPasswordValidation,
  updatePasswordValidation,
} from '../validator/auth-validation.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../security/rate-limiter.js';
import passport from '@/src/config/passport.js';

const router = Router();
//rateLimiter()

router.get(
  '/sign-in/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
);

router.get(
  '/sign-in/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login?error=google_auth_failed',
  }),
  authController.googleAuth,
);

router.post('/sign-in', signInValidation, authController.signIn);

router.post('/sign-up', signupValidation, authController.signup);

router.post('/log-out', authMiddleware, authController.logOut);

router.post('/refresh', authController.handleRefreshToken);

router.patch(
  '/update-password',
  authMiddleware,
  updatePasswordValidation,
  authController.updatePassword,
);

router.post(
  '/forgot-password',
  // rateLimiter(3),
  forgetPasswordValidation,
  authController.forgetPassword,
);

router.post(
  '/verify-code',
  // rateLimiter(),
  verifyResetCodeValidation,
  authController.verifyResetCode,
);

router.patch(
  '/reset-password',
  rateLimiter(2),
  resetPasswordValidation,
  authController.resetPassword,
);

export const AuthRoutes = router;
