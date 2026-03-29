import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canManageProduct, isSuperadmin } from '@/lib/auth/roles';
import { buildPaginatedResult, parsePaginationParams } from '@/lib/api/pagination';
import type { ProductWithBusiness } from '@/lib/sdk/types';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  const categoryId = searchParams.get('categoryId');
  const managedIds = session?.user?.managedBusinessIds;
  const onlyManaged =
    !isSuperadmin(session?.user?.roles) &&
    Array.isArray(managedIds) &&
    managedIds.length > 0;
  try {
    const baseWhere = {
      ...(businessId != null && businessId !== '' && { businessId }),
      ...(categoryId != null &&
        categoryId !== '' && {
          categories: {
            some: { categoryId },
          },
        }),
    };
    const where =
      onlyManaged && managedIds?.length
        ? {
            ...baseWhere,
            businessId: managedIds.length === 1 ? managedIds[0] : { in: managedIds },
          }
        : baseWhere;
    const { page, pageSize, skip, take } = parsePaginationParams(searchParams);
    const [items, total] = await prisma.$transaction([
      prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          business: { select: { id: true, name: true, slug: true } },
          categories: { select: { category: { select: { id: true, name: true } } } },
          productCategories: { select: { productCategory: { select: { id: true, name: true } } } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.product.count({ where }),
    ]);
    return NextResponse.json(
      buildPaginatedResult(items as ProductWithBusiness[], total, page, pageSize)
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
  const body = await request.json();
  const {
    businessId: bodyBusinessId,
    name,
    description,
    price,
    image,
    categoryIds,
    productCategoryIds,
  } = body as {
    businessId: string;
    name: string;
    description?: string;
    price?: number | string;
    image?: string;
    categoryIds?: string[];
    productCategoryIds?: string[];
  };
  if (!bodyBusinessId || typeof bodyBusinessId !== 'string') {
    return NextResponse.json({ error: 'businessId is required' }, { status: 400 });
  }
  if (!name || typeof name !== 'string') {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }
  if (!canManageProduct(session.user.roles, session.user.managedBusinessIds, bodyBusinessId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  if (Array.isArray(productCategoryIds) && productCategoryIds.length > 0) {
    const productCategories = await prisma.productCategory.findMany({
      where: { id: { in: productCategoryIds } },
      select: { id: true, businessId: true },
    });
    const invalid = productCategories.some((pc) => pc.businessId !== bodyBusinessId);
    if (invalid || productCategories.length !== productCategoryIds.length) {
      return NextResponse.json(
        { error: 'Todas las categorías de producto deben pertenecer al mismo negocio' },
        { status: 400 }
      );
    }
  }
  try {
    const priceDecimal =
      price != null
        ? typeof price === 'string'
          ? parseFloat(price)
          : Number(price)
        : undefined;
    const created = await prisma.product.create({
      data: {
        businessId: bodyBusinessId,
        name,
        description,
        price: priceDecimal != null && !Number.isNaN(priceDecimal) ? priceDecimal : undefined,
        image,
        categories:
          Array.isArray(categoryIds) && categoryIds.length > 0
            ? {
                create: categoryIds.map((catId: string) => ({ categoryId: catId })),
              }
            : undefined,
        productCategories:
          Array.isArray(productCategoryIds) && productCategoryIds.length > 0
            ? {
                create: productCategoryIds.map((pcId: string) => ({ productCategoryId: pcId })),
              }
            : undefined,
      },
      include: {
        business: { select: { id: true, name: true, slug: true } },
        productCategories: { select: { productCategory: { select: { id: true, name: true } } } },
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
