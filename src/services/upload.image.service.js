import { supabase } from '../config/supabase.js';

export const uploadImage = async ({ bucket, path, file, contentType }) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};

export const removeImage = async ({ bucket, path }) => {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw new Error(error.message);

  return data;
};
