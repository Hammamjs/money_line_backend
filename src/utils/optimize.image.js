import sharp from 'sharp';

const optimizeImage = async (image) => {
  return await sharp(image)
    .resize({
      width: 1200,
      height: 1200,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();
};

export default optimizeImage;
