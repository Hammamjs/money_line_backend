import { Errors } from '../errors/map.errors.js';

export const validateImage = ({ buffer, mimetype }) => {
  const FIVE_MB = 5 * 1024 * 1024;
  if (buffer.length > FIVE_MB)
    throw Errors.badRequest('Image size must be less than 5MB');

  if (!mimetype.startsWith('image/'))
    throw Errors.badRequest('Only images are allowed');
};
