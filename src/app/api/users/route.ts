import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { isSuperadmin } from '@/lib/auth/roles';
import type { UserWithRolesAndBusinesses } from '@/lib/sdk/types';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSuperadmin(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastname: true,
        email: true,
        image: true,
        createdAt: true,
        roles: { select: { role: { select: { id: true, name: true } } } },
        businessAdmins: { select: { business: { select: { id: true, name: true, slug: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(users as UserWithRolesAndBusinesses[]);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
