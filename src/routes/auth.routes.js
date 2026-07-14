import { Router } from 'express';
import { authController } from '../controller/auth.controller.js';
import {
  resetPasswordValidation,
  signInValidation,
  signupValidation,
  verifyResetCodeValidation,
  forgetPasswordValidation,
} from '../validator/auth.validation.js';

const router = Router();

router.post('/sign-in', signInValidation, authController.signIn);

router.post('/sign-up', signupValidation, authController.signup);

router.post(
  '/forgot-password',
  forgetPasswordValidation,
  authController.forgetPassword,
);

router.post(
  '/verify-code',
  verifyResetCodeValidation,
  authController.verifyResetCode,
);

router.patch(
  '/reset-password',
  resetPasswordValidation,
  authController.resetPassword,
);

export const AuthRoutes = router;
