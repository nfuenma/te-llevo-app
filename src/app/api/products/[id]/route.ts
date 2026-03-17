import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canManageProduct } from '@/lib/auth/roles';
import type { ProductWithBusiness } from '@/lib/sdk/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const item = await prisma.product.findUnique({
    where: { id },
    select: { businessId: true, business: { select: { id: true, name: true, slug: true } }, categories: { select: { category: { select: { id: true, name: true } } } }, productCategories: { select: { productCategory: { select: { id: true, name: true } } } }, id: true, name: true, description: true, price: true, image: true, createdAt: true, updatedAt: true },
  });
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (session?.user && !canManageProduct(session.user.roles, session.user.managedBusinessIds, item.businessId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    return NextResponse.json(item as ProductWithBusiness);
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
  const existing = await prisma.product.findUnique({ where: { id }, select: { businessId: true } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!canManageProduct(session.user.roles, session.user.managedBusinessIds, existing.businessId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  const {
    name,
    description,
    price,
    image,
    categoryIds,
    productCategoryIds,
  } = body as {
      name?: string;
      description?: string;
      price?: number | string;
      image?: string;
      categoryIds?: string[];
      productCategoryIds?: string[];
    };
  if (Array.isArray(productCategoryIds) && productCategoryIds.length > 0) {
    const productCategories = await prisma.productCategory.findMany({
      where: { id: { in: productCategoryIds } },
      select: { id: true, businessId: true },
    });
    const invalid = productCategories.some((pc) => pc.businessId !== existing.businessId);
    if (invalid || productCategories.length !== productCategoryIds.length) {
      return NextResponse.json(
        { error: 'Todas las categorías de producto deben pertenecer al negocio del producto' },
        { status: 400 }
      );
    }
  }
  try {
    const updateData: Record<string, unknown> = {};
    if (typeof name === 'string') updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) {
      const p = typeof price === 'string' ? parseFloat(price) : Number(price);
      updateData.price = Number.isNaN(p) ? undefined : p;
    }
    if (typeof image === 'string') updateData.image = image;
    if (Array.isArray(categoryIds)) {
      updateData.categories = {
        deleteMany: {},
        create: categoryIds.map((categoryId: string) => ({ categoryId })),
      };
    }
    if (Array.isArray(productCategoryIds)) {
      updateData.productCategories = {
        deleteMany: {},
        create: productCategoryIds.map((pcId: string) => ({ productCategoryId: pcId })),
      };
    }
    const updated = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        business: { select: { id: true, name: true, slug: true } },
        categories: { select: { category: { select: { id: true, name: true } } } },
        productCategories: { select: { productCategory: { select: { id: true, name: true } } } },
      },
    });
    return NextResponse.json(updated as ProductWithBusiness);
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
  const existing = await prisma.product.findUnique({ where: { id }, select: { businessId: true } });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!canManageProduct(session.user.roles, session.user.managedBusinessIds, existing.businessId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
