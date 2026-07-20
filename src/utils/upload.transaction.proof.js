import { uploadImage } from '../services/upload.image.service.js';
import optimizeImage from './optimize.image.js';
import { randomUUID } from 'crypto';

export const uploadTransactionProof = async (buffer) => {
  const optimizedImage = await optimizeImage(buffer);

  return await uploadImage({
    bucket: process.env.BUCKET_NAME,
    file: optimizedImage,
    path: `img-${randomUUID()}.webp`,
    contentType: 'image/webp',
  });
};
