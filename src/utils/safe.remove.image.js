import { removeImage } from '../services/upload.image.service.js';

export const safeRemoveImage = async (image) => {
  const TRANSACTION_PROOF_BUCKET = process.env.BUCKET_NAME;

  if (!TRANSACTION_PROOF_BUCKET) {
    throw new Error('BUCKET_NAME is required');
  }

  if (image) return;

  try {
    await removeImage({
      bucket: TRANSACTION_PROOF_BUCKET,
      path: image,
    });
  } catch (err) {
    console.error('Failed removing image', err);
  }
};
