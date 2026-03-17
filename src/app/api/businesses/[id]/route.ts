import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canManageBusiness } from '@/lib/auth/roles';
import type { BusinessWithRelations } from '@/lib/sdk/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  if (session?.user && !canManageBusiness(session.user.roles, session.user.managedBusinessIds, id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const item = await prisma.business.findUnique({
      where: { id },
      include: {
        categories: { select: { category: { select: { id: true, name: true } } } },
        _count: { select: { products: true } },
      },
    });
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(item as BusinessWithRelations);
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
  const { id } = await params;
  if (!canManageBusiness(session.user.roles, session.user.managedBusinessIds, id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
      name?: string;
      slug?: string;
      description?: string;
      address?: string;
      image?: string;
      categoryIds?: string[];
    };
    const updateData: Record<string, unknown> = {};
    if (typeof name === 'string') updateData.name = name;
    if (typeof slug === 'string') updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (address !== undefined) updateData.address = address;
    if (typeof image === 'string') updateData.image = image;
    if (Array.isArray(categoryIds)) {
      updateData.categories = {
        deleteMany: {},
        create: categoryIds.map((categoryId: string) => ({ categoryId })),
      };
    }
    const updated = await prisma.business.update({
      where: { id },
      data: updateData,
      include: {
        categories: { select: { category: { select: { id: true, name: true } } } },
      },
    });
    return NextResponse.json(updated as BusinessWithRelations);
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
  const { id } = await params;
  if (!canManageBusiness(session.user.roles, session.user.managedBusinessIds, id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await prisma.business.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
