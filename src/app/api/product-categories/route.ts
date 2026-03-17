import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canManageBusiness } from '@/lib/auth/roles';
import type { ProductCategoryWithBusiness } from '@/lib/sdk/types';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get('businessId');
  if (!businessId) {
    return NextResponse.json(
      { error: 'businessId is required' },
      { status: 400 }
    );
  }
  if (session?.user && !canManageBusiness(session.user.roles, session.user.managedBusinessIds, businessId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const items = await prisma.productCategory.findMany({
      where: { businessId },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(items as ProductCategoryWithBusiness[]);
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
  const { businessId, name, image } = body as {
    businessId: string;
    name: string;
    image?: string;
  };
  if (!businessId || typeof name !== 'string') {
    return NextResponse.json(
      { error: 'businessId and name are required' },
      { status: 400 }
    );
  }
  if (!canManageBusiness(session.user.roles, session.user.managedBusinessIds, businessId)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const created = await prisma.productCategory.create({
      data: {
        businessId,
        name,
        image: typeof image === 'string' ? image : undefined,
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
