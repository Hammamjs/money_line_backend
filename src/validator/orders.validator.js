import { check, param } from 'express-validator';
import { validation } from '../config/validation.js';
export const createOrderValidation = [
  check('paymentProvider')
    .trim()
    .notEmpty()
    .withMessage('Payment provider is required')
    .isLength({ min: 2 })
    .withMessage('Payment provider must be at least 2 charcters'),
  check('phone').trim().notEmpty().withMessage('Phone number is required'),
  check('accountHolderName')
    .trim()
    .notEmpty()
    .withMessage('Account holder name is required'),
  check('amount').notEmpty().withMessage('Transfered amount is required'),
  check('fromAssetId')
    .notEmpty()
    .withMessage('From asset id is required')
    .isUUID()
    .withMessage('Invalid from asset id format'),
  check('toAssetId')
    .notEmpty()
    .withMessage('To asset id is required')
    .isUUID()
    .withMessage('Invalid to asset id format'),

  check('note')
    .optional()
    .exists({ checkNull: true })
    .withMessage('note cannot be empty'),

  validation,
];

export const updateOrderValidation = [
  param('id')
    .notEmpty()
    .withMessage('Id param is requred')
    .isUUID()
    .withMessage('Invalid id format'),
  check('paymentProvider')
    .optional()
    .notEmpty()
    .withMessage('Payment provider is required')
    .isLength({ min: 2 })
    .withMessage('Payment provider must be at least 2 charcters'),

  check('userId')
    .trim()
    .optional()
    .notEmpty()
    .withMessage('The order must belong to user')
    .isUUID()
    .withMessage('Invalid user id'),
  check('transactionProof')
    .trim()
    .optional()
    .notEmpty()
    .withMessage('Transaction proof is required'),
  check('phone')
    .trim()
    .optional()
    .notEmpty()
    .withMessage('Phone cannot be empty'),
  check('accountHolderName')
    .trim()
    .optional()
    .notEmpty()
    .withMessage('Account holder name is required'),

  validation,
];

export const getOrderByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isUUID()
    .withMessage('Invalid id format'),
  validation,
];

export const getOrderByUserIdValidation = [
  param('userId')
    .notEmpty()
    .withMessage('User id is required')
    .isUUID()
    .withMessage('Invalid id format'),
  validation,
];

export const deleteOrderByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('Id is required')
    .isUUID()
    .withMessage('Invalid id format'),
  validation,
];

export const updateStatusValidation = [
  param('id')
    .exists({ checkNull: true })
    .withMessage('Id is required')
    .isUUID()
    .withMessage('Invalid id format'),
  check('status')
    .isIn(['pending', 'success'])
    .withMessage('Invalid status value'),

  validation,
];
