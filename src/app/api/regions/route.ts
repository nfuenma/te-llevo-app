import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canManageCatalog } from '@/lib/auth/roles';
import type { RegionWithCategories } from '@/lib/sdk/types';

export async function GET() {
  try {
    const items = await prisma.region.findMany({
      include: {
        categories: { select: { category: { select: { id: true, name: true, image: true } } } },
        _count: { select: { categories: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(items as RegionWithCategories[]);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!canManageCatalog(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { name, image, categoryIds } = body as { name: string; image?: string; categoryIds?: string[] };
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    const created = await prisma.region.create({
      data: {
        name,
        image: typeof image === 'string' ? image : undefined,
        categories:
          Array.isArray(categoryIds) && categoryIds.length > 0
            ? {
                create: categoryIds.map((categoryId: string) => ({ categoryId })),
              }
            : undefined,
      },
      include: {
        categories: { select: { category: { select: { id: true, name: true, image: true } } } },
      },
    });
    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
