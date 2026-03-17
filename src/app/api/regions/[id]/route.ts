import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canManageCatalog } from '@/lib/auth/roles';
import type { RegionWithCategories } from '@/lib/sdk/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const item = await prisma.region.findUnique({
      where: { id },
      include: {
        categories: { select: { category: { select: { id: true, name: true, image: true } } } },
        _count: { select: { categories: true } },
      },
    });
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(item as RegionWithCategories);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!canManageCatalog(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, image, categoryIds } = body as { name?: string; image?: string; categoryIds?: string[] };
    const updateData: Record<string, unknown> = {};
    if (typeof name === 'string') updateData.name = name;
    if (image !== undefined) updateData.image = image === '' ? null : image;
    // Si viene categoryIds (array, puede ser vacío) reemplazamos todas las categorías de la región
    if (categoryIds !== undefined && Array.isArray(categoryIds)) {
      updateData.categories = {
        deleteMany: {},
        create: categoryIds.map((categoryId: string) => ({ categoryId })),
      };
    }
    const updated = await prisma.region.update({
      where: { id },
      data: updateData,
      include: {
        categories: { select: { category: { select: { id: true, name: true, image: true } } } },
      },
    });
    return NextResponse.json(updated as RegionWithCategories);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!canManageCatalog(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  try {
    await prisma.region.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
