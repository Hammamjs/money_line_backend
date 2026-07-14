import { check, param } from 'express-validator';
import { validation } from '../config/validation.js';

export const getCurrencyByIdValidation = [
  param('id').isUUID().withMessage('Invalid id format'),

  validation,
];

export const deleteCurrencyValidation = [
  param('id').isUUID().withMessage('Invalid id format'),

  validation,
];

export const updateCurrencyValidation = [
  param('id').isUUID().withMessage('Invalid id format'),
  check('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Currency name must be at least 3 characters'),

  check('code')
    .optional()
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency code must be 3 characters only'),

  check('symbol')
    .optional()
    .trim()
    .isLength({ min: 1, max: 1 })
    .withMessage('Symbol must be one character'),

  validation,
];

export const createCurrencyValidation = [
  check('name')
    .notEmpty()
    .withMessage('Currency name is required')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Currency name must be at least 3 characters'),

  check('code')
    .notEmpty()
    .withMessage('Currency code is required')
    .trim()
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency code must be 3 characters only'),

  check('symbol')
    .notEmpty()
    .withMessage('Symbol is requred')
    .trim()
    .isLength({ max: 1 })
    .withMessage('Symbol must be one character'),

  validation,
];
