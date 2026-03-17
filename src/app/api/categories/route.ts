import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { canManageCatalog } from '@/lib/auth/roles';
import type { CategoryWithCount } from '@/lib/sdk/types';

export async function GET() {
  try {
    const items = await prisma.category.findMany({
      include: { _count: { select: { businesses: true } } },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(items as CategoryWithCount[]);
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
    const { name, tags, image } = body as { name: string; tags?: string[]; image?: string };
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    const created = await prisma.category.create({
      data: {
        name,
        tags: Array.isArray(tags) ? tags : [],
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
