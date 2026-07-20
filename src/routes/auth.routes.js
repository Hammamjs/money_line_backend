import { Router } from 'express';
import { authController } from '../controller/auth.controller.js';
import {
  resetPasswordValidation,
  signInValidation,
  signupValidation,
  verifyResetCodeValidation,
  forgetPasswordValidation,
} from '../validator/auth.validation.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { rateLimiter } from '../security/rate.limiter.js';

const router = Router();

router.post('/sign-in', rateLimiter(), signInValidation, authController.signIn);

router.post('/sign-up', rateLimiter, signupValidation, authController.signup);

router.post('/log-out', authMiddleware, authController.logOut);

router.post('/refresh', rateLimiter(2), authController.handleRefreshToken);

router.post(
  '/forgot-password',
  rateLimiter(3),
  forgetPasswordValidation,
  authController.forgetPassword,
);

router.post(
  '/verify-code',
  rateLimiter(),
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
