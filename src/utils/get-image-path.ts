export const getImagePath = (url: string) => {
  try {
    return new URL(url).pathname.split('/').pop();
  } catch {
    return url;
  }
};
