import { check, param } from 'express-validator';
import { validation } from '../config/validation.js';

export const getAccountByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Id is requred')
    .isUUID()
    .withMessage('Invalid id format'),

  validation,
];

export const deleteAccountByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Id is requred')
    .isUUID()
    .withMessage('Invalid id format'),

  validation,
];

export const createAccountValidation = [
  check('accountNumber')
    .notEmpty()
    .withMessage('Account number is required')
    .isLength({ min: 10 })
    .withMessage('Account number must be at least 10 digits'),

  check('iban')
    .notEmpty()
    .withMessage('IBAN is requred')
    .isLength({ min: 15, max: 34 })
    .withMessage('IBAN must be at least 15 charcter'),
  check('phoneNumber')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone(['en-US', 'ar-SD', 'ar-SA'])
    .withMessage(
      'Only Saudi Arabia, Sudan, and Egypt phone numbers are allowed',
    ),
  check('isDefault')
    .optional()
    .isBoolean()
    .withMessage('Only allowed boolean values'),

  validation,
];

export const updateAccountValidation = [
  check('id')
    .notEmpty()
    .withMessage('Id is required')
    .isUUID()
    .withMessage('Invalid id'),
  check('accountNumber')
    .optional()
    .notEmpty()
    .withMessage('Account number is required')
    .isLength({ min: 10 })
    .withMessage('Account number must be at least 10 digits'),

  check('iban')
    .optional()
    .isLength({ min: 15, max: 34 })
    .withMessage('IBAN must be at least 15 charcter'),
  check('phoneNumber')
    .optional()
    .isMobilePhone(['en-US', 'ar-SD', 'ar-SA'])
    .withMessage(
      'Only Saudi Arabia, Sudan, and Egypt phone numbers are allowed',
    ),
  check('isDefault')
    .optional()
    .isBoolean()
    .withMessage('Only allowed boolean values'),

  validation,
];
