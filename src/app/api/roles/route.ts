import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { isSuperadmin } from '@/lib/auth/roles';
import { buildPaginatedResult, parsePaginationParams } from '@/lib/api/pagination';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSuperadmin(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const { page, pageSize, skip, take } = parsePaginationParams(searchParams);
    const [items, total] = await prisma.$transaction([
      prisma.role.findMany({
        skip,
        take,
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),
      prisma.role.count(),
    ]);
    return NextResponse.json(buildPaginatedResult(items, total, page, pageSize));
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
  if (!isSuperadmin(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const body = await request.json();
    const { name } = body as { name?: string };
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    const created = await prisma.role.create({
      data: { name: name.trim() },
    });
    return NextResponse.json(created);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
