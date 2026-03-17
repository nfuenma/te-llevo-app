import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canManageBusiness } from '@/lib/auth/roles';
import type { ProductCategory } from '@/lib/sdk/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const item = await prisma.productCategory.findUnique({
    where: { id },
  });
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (session?.user && !canManageBusiness(session.user.roles, session.user.managedBusinessIds, item.businessId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return NextResponse.json(item as ProductCategory);
}

export async function PUT(request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const existing = await prisma.productCategory.findUnique({
    where: { id },
    select: { businessId: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!canManageBusiness(session.user.roles, session.user.managedBusinessIds, existing.businessId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  const { name, image } = body as { name?: string; image?: string };
  const updateData: { name?: string; image?: string | null } = {};
  if (typeof name === 'string') updateData.name = name;
  if (image !== undefined) updateData.image = image === '' ? null : image;
  const updated = await prisma.productCategory.update({
    where: { id },
    data: updateData,
  });
  return NextResponse.json(updated as ProductCategory);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const existing = await prisma.productCategory.findUnique({
    where: { id },
    select: { businessId: true },
  });
  if (!existing) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (!canManageBusiness(session.user.roles, session.user.managedBusinessIds, existing.businessId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  await prisma.productCategory.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
