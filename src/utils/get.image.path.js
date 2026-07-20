export const getImagePath = (url) => {
  try {
    return new URL(url).pathname.split('/').pop();
  } catch {
    return url;
  }
};
