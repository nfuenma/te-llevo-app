import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canManageCatalog } from '@/lib/auth/roles';
import { buildPaginatedResult, parsePaginationParams } from '@/lib/api/pagination';
import type { RegionWithCategories } from '@/lib/sdk/types';

const regionInclude = {
  categories: { select: { category: { select: { id: true, name: true, image: true } } } },
  _count: { select: { categories: true } },
} as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip, take } = parsePaginationParams(searchParams);
    const q = searchParams.get('q')?.trim() ?? '';
    const where =
      q.length > 0 ? { name: { contains: q, mode: 'insensitive' as const } } : undefined;
    const [items, total] = await prisma.$transaction([
      prisma.region.findMany({
        where,
        skip,
        take,
        include: regionInclude,
        orderBy: { name: 'asc' },
      }),
      prisma.region.count({ where }),
    ]);
    return NextResponse.json(
      buildPaginatedResult(items as RegionWithCategories[], total, page, pageSize)
    );
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
      include: regionInclude,
    });
    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
