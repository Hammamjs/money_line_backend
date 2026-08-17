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

export const updateOneNotificationValidation = [
  param('id')
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
  check('title').trim().notEmpty().withMessage('Title is required'),
  check('userId')
    .trim()
    .notEmpty()
    .withMessage('User id is required')
    .isUUID()
    .withMessage('Invalid user id format'),
  validation,
];

export const notifyUsersValidation = [
  check('message').notEmpty().withMessage('Message is required'),

  validation,
];
