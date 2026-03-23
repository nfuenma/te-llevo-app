import { v2 as cloudinary } from 'cloudinary';

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v && v.trim() !== '' ? v : undefined;
}

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    getEnv('CLOUDINARY_CLOUD_NAME') &&
      getEnv('CLOUDINARY_API_KEY') &&
      getEnv('CLOUDINARY_API_SECRET')
  );
}

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: getEnv('CLOUDINARY_CLOUD_NAME'),
    api_key: getEnv('CLOUDINARY_API_KEY'),
    api_secret: getEnv('CLOUDINARY_API_SECRET'),
    secure: true,
  });
}

export async function uploadOptimizedImage(
  buffer: Buffer,
  options: { folder: string; format: 'webp' | 'jpeg' }
): Promise<string> {
  configureCloudinary();

  const uploadOptions = {
    folder: options.folder,
    resource_type: 'image' as const,
    /** Cloudinary infiere WebP/JPEG del buffer; `format` alinea la extensión pública. */
    format: options.format === 'jpeg' ? 'jpg' : options.format,
    overwrite: true,
    unique_filename: true,
  };

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
      if (err || !result?.secure_url) {
        reject(err ?? new Error('Cloudinary no devolvió URL'));
        return;
      }
      resolve(result.secure_url);
    });
    stream.end(buffer);
  });
}
