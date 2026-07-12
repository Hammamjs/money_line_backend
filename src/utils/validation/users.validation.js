import { check, param } from 'express-validator';
import { validation } from '../../config/validation.js';

export const createUserValidation = [
  check('username')
    .notEmpty()
    .withMessage('username is required')
    .isLength({ min: 3 })
    .withMessage('username must be at least 3 charcters')
    .isString()
    .trim(),
  check('email').notEmpty().withMessage('Email is required').isEmail(),
  check('phone').isString().trim().optional(),

  validation,
];

export const updateUserValidation = [
  check('id').notEmpty().isUUID(),
  check('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 charcters')
    .isString()
    .trim()
    .optional(),
  check('phone')
    .isString()
    .withMessage('phone must be string')
    .trim()
    .optional(),

  validation,
];

export const getByIdValidation = [
  param('id').notEmpty().isUUID().withMessage('Id param must be uuid format'),
  validation,
];

export const deleteUserValidation = [
  param('id').notEmpty().isUUID().withMessage('Id param must be uuid format'),
  validation,
];
