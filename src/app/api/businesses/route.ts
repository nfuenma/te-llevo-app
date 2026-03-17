import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canCreateBusiness, isSuperadmin } from '@/lib/auth/roles';
import type { BusinessWithRelations } from '@/lib/sdk/types';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const managedIds = session?.user?.managedBusinessIds;
  const onlyManaged =
    !isSuperadmin(session?.user?.roles) &&
    Array.isArray(managedIds) &&
    managedIds.length > 0;
  try {
    const where: { id?: { in: string[] }; categories?: { some: { categoryId: string } } } = {};
    if (categoryId != null && categoryId !== '') {
      where.categories = { some: { categoryId } };
    }
    if (onlyManaged && managedIds) {
      where.id = { in: managedIds };
    }
    const items = await prisma.business.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: {
        categories: { select: { category: { select: { id: true, name: true } } } },
        _count: { select: { products: true } },
      },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(items as BusinessWithRelations[]);
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
  if (!canCreateBusiness(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden: solo superadmin puede crear negocios' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      address,
      image,
      categoryIds,
    } = body as {
      name: string;
      slug: string;
      description?: string;
      address?: string;
      image?: string;
      categoryIds?: string[];
    };
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }
    const created = await prisma.business.create({
      data: {
        name,
        slug,
        description,
        address,
        image,
        categories:
          Array.isArray(categoryIds) && categoryIds.length > 0
            ? {
                create: categoryIds.map((categoryId: string) => ({
                  categoryId,
                })),
              }
            : undefined,
      },
      include: {
        categories: { select: { category: { select: { id: true, name: true } } } },
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
