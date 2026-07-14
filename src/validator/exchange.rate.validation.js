import { check, param } from 'express-validator';
import { validation } from '../config/validation.js';

export const getExchangeRateByIdValidation = [
  check('id')
    .exists({ checkNull: true })
    .withMessage('id is requried')
    .bail()
    .isUUID()
    .withMessage('Invalid id format'),
  validation,
];

export const deleteExchangeRateValidation = [
  check('id').isUUID().withMessage('Invalid id format'),
  validation,
];

export const createExchangeRateValidation = [
  check('fromCurrencyId')
    .exists({ checkNull: true })
    .withMessage('id is requried')
    .bail()
    .isUUID()
    .withMessage('Invalid id format'),
  check('toCurrencyId')
    .exists({ checkNull: true })
    .withMessage('id is requried')
    .bail()
    .isUUID()
    .withMessage('Invalid id format'),
  check('rate')
    .exists({ checkNull: true })
    .withMessage('Rate is required')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('Rate must be greater 0'),
  validation,
];

export const updateExchangeRateValidation = [
  check('id')
    .exists({ checkNull: true })
    .withMessage('id is requried')
    .bail()
    .isUUID()
    .withMessage('Invalid id format'),
  check('rate')
    .exists({ checkNull: true })
    .withMessage('id is requried')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('Rate must be greater 0'),
  validation,
];
