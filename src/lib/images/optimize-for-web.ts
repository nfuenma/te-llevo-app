import sharp from 'sharp';

/** Objetivo máximo por imagen tras optimizar (bytes). */
export const MAX_OPTIMIZED_IMAGE_BYTES = 200 * 1024;

const MAX_INPUT_BYTES = 15 * 1024 * 1024;
const INITIAL_MAX_EDGE = 1600;
const MIN_MAX_EDGE_WEBP = 220;
const MIN_QUALITY_WEBP = 22;

export class ImageOptimizeError extends Error {
  constructor(
    message: string,
    public readonly code: 'FILE_TOO_LARGE' | 'INVALID_IMAGE' | 'STILL_TOO_LARGE'
  ) {
    super(message);
    this.name = 'ImageOptimizeError';
  }
}

export function assertAcceptableInputSize(byteLength: number) {
  if (byteLength > MAX_INPUT_BYTES) {
    throw new ImageOptimizeError('El archivo supera el tamaño máximo permitido (15 MB).', 'FILE_TOO_LARGE');
  }
}

export type OptimizedImage = {
  buffer: Buffer;
  /** Formato final (Cloudinary / content-type). */
  format: 'webp' | 'jpeg';
};

/**
 * Redimensiona y comprime la imagen para acercarse a MAX_OPTIMIZED_IMAGE_BYTES.
 * Prioriza WebP; si no alcanza, prueba JPEG más agresivo.
 */
export async function optimizeImageToMaxBytes(input: Buffer): Promise<OptimizedImage> {
  assertAcceptableInputSize(input.length);

  let maxEdge = INITIAL_MAX_EDGE;

  try {
    while (maxEdge >= MIN_MAX_EDGE_WEBP) {
      const base = sharp(input)
        .rotate()
        .resize({
          width: maxEdge,
          height: maxEdge,
          fit: 'inside',
          withoutEnlargement: true,
        });

      for (let q = 82; q >= MIN_QUALITY_WEBP; q -= 6) {
        const buf = await base.clone().webp({ quality: q, effort: 4 }).toBuffer();
        if (buf.length <= MAX_OPTIMIZED_IMAGE_BYTES) {
          return { buffer: buf, format: 'webp' };
        }
      }

      const lowest = await base.webp({ quality: MIN_QUALITY_WEBP, effort: 4 }).toBuffer();
      if (lowest.length <= MAX_OPTIMIZED_IMAGE_BYTES) {
        return { buffer: lowest, format: 'webp' };
      }

      maxEdge = Math.floor(maxEdge * 0.78);
    }

    for (let w = 400; w >= 160; w -= 60) {
      for (let q = 55; q >= 18; q -= 7) {
        const buf = await sharp(input)
          .rotate()
          .resize({
            width: w,
            height: w,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .jpeg({ quality: q, mozjpeg: true })
          .toBuffer();
        if (buf.length <= MAX_OPTIMIZED_IMAGE_BYTES) {
          return { buffer: buf, format: 'jpeg' };
        }
      }
    }
  } catch {
    throw new ImageOptimizeError('No se pudo procesar la imagen.', 'INVALID_IMAGE');
  }

  throw new ImageOptimizeError(
    'No se pudo reducir la imagen por debajo de 200 KB. Prueba otra foto o recórtala antes.',
    'STILL_TOO_LARGE'
  );
}
