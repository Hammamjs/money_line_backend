import { check } from 'express-validator';
import { validation } from '../config/validation.js';

export const signInValidation = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email signature')
    .trim()
    .normalizeEmail(),

  check('password').notEmpty().withMessage('Password is required'),

  validation,
];

export const updatePasswordValidation = [
  check('newPassword')
    .notEmpty()
    .withMessage('Password is required')
    .isStrongPassword()
    .withMessage('Password must be strong'),

  check('currentPassword').notEmpty().withMessage('Old password is required'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('Confrim password is required')
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) throw new Error('Passwords must match');
      return true;
    }),
];

export const signupValidation = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email signature')
    .trim()
    .normalizeEmail(),

  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 charcters')
    .isStrongPassword()
    .withMessage('Password must be strong'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('Confirm message is required')
    .custom((val, { req }) => {
      if (val !== req.body.password) throw new Error('Passwords must match');
      return true;
    }),

  check('username')
    .notEmpty()
    .withMessage('username is requried')
    .isLength({ min: 3 })
    .withMessage('username must be at least 3 charcters')
    .trim(),

  check('phone').optional(),

  validation,
];

export const forgetPasswordValidation = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  validation,
];

export const verifyResetCodeValidation = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid Email format'),

  check('resetCode')
    .notEmpty()
    .withMessage('Reset code is required')
    .isLength({ min: 6, max: 6 })
    .withMessage('Code length must be 6 digits'),

  validation,
];

export const resetPasswordValidation = [
  check('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format'),
  check('newPassword')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 6 digits'),

  check('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is requred')
    .custom((v, { req }) => {
      if (v !== req.body.newPassword) throw new Error('Passwords do not match');
      return true;
    }),

  validation,
];
