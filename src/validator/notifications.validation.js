import { check, param } from 'express-validator';
import { validation } from '../config/validation.js';

export const getNotificationByIdValidation = [
  param('id')
    .notEmpty()
    .withMessage('notification id is required')
    .isUUID()
    .withMessage('ID format is invlaid'),

  validation,
];

export const updateNotificationValidation = [
  param('id')
    .notEmpty()
    .withMessage('notification id is required')
    .isUUID()
    .withMessage('ID format is invlaid'),

  validation,
];

export const getNotificationByUserIdValidation = [
  param('userId')
    .notEmpty()
    .withMessage('notification id is required')
    .isUUID()
    .withMessage('ID format is invlaid'),

  validation,
];

export const deleteNotificationValidation = [
  param('id')
    .notEmpty()
    .withMessage('notification id is required')
    .isUUID()
    .withMessage('ID format is invlaid'),

  validation,
];

export const createNotificaionValidation = [
  check('message').trim().notEmpty().withMessage('Message cannot be empty'),
  check('userId')
    .trim()
    .notEmpty()
    .withMessage('User id is required')
    .isUUID()
    .withMessage('Invalid user id format'),
  validation,
];
