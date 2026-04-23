import { supabase } from './supabase';

const BUCKET_NAME = 'legal-documents';

export async function uploadFile(userId: string, file: File): Promise<{ path: string; url: string } | null> {
  const fileId = crypto.randomUUID();
  const ext = file.name.split('.').pop() || 'bin';
  const fileName = `${fileId}.${ext}`;
  const filePath = `${userId}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Upload error:', error);
    return null;
  }

  return {
    path: filePath,
    url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${filePath}`,
  };
}

export async function getSignedUrl(filePath: string, expiresIn: number = 3600): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}

export async function deleteFile(filePath: string): Promise<boolean> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

  if (error) {
    console.error('Delete error:', error);
    return false;
  }

  return true;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
