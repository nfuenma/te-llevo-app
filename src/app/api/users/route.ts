import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { isSuperadmin } from '@/lib/auth/roles';
import { buildPaginatedResult, parsePaginationParams } from '@/lib/api/pagination';
import type { UserWithRolesAndBusinesses } from '@/lib/sdk/types';

const userListSelect = {
  id: true,
  name: true,
  lastname: true,
  email: true,
  image: true,
  createdAt: true,
  roles: { select: { role: { select: { id: true, name: true } } } },
  businessAdmins: { select: { business: { select: { id: true, name: true, slug: true } } } },
} as const;

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
      prisma.user.findMany({
        skip,
        take,
        select: userListSelect,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);
    return NextResponse.json(
      buildPaginatedResult(items as UserWithRolesAndBusinesses[], total, page, pageSize)
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
