import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { canManageCatalog } from '@/lib/auth/roles';
import { optimizeImageToMaxBytes, ImageOptimizeError } from '@/lib/images/optimize-for-web';
import { isCloudinaryConfigured, uploadOptimizedImage } from '@/lib/cloudinary/server';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!canManageCatalog(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      {
        error:
          'Cloudinary no está configurado. Define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.',
      },
      { status: 503 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 });
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Falta el campo file' }, { status: 400 });
  }

  const mime = (file.type || '').toLowerCase();
  if (!ALLOWED_TYPES.has(mime)) {
    return NextResponse.json(
      { error: 'Formato no permitido. Usa JPEG, PNG, WebP o GIF.' },
      { status: 400 }
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const input = Buffer.from(arrayBuffer);

  try {
    const optimized = await optimizeImageToMaxBytes(input);
    const url = await uploadOptimizedImage(optimized.buffer, {
      folder: 'te-llevo/regions',
      format: optimized.format,
    });
    return NextResponse.json({
      url,
      bytes: optimized.buffer.length,
      format: optimized.format,
    });
  } catch (e) {
    if (e instanceof ImageOptimizeError) {
      const status =
        e.code === 'FILE_TOO_LARGE' ? 413 : e.code === 'STILL_TOO_LARGE' ? 422 : 400;
      return NextResponse.json({ error: e.message, code: e.code }, { status });
    }
    console.error('[upload/regions]', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error al subir la imagen' },
      { status: 500 }
    );
  }
}
