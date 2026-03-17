import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { isSuperadmin } from '@/lib/auth/roles';
import type { UserWithRolesAndBusinesses } from '@/lib/sdk/types';

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isSuperadmin(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
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
    });
    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(user as UserWithRolesAndBusinesses);
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
  if (!isSuperadmin(session.user.roles)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const { id } = await params;
  try {
    const body = await request.json();
    const { roleIds, businessIds } = body as {
      roleIds?: string[];
      businessIds?: string[];
    };
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (Array.isArray(roleIds)) {
      await prisma.userRole.deleteMany({ where: { userId: id } });
      if (roleIds.length > 0) {
        await prisma.userRole.createMany({
          data: roleIds.map((roleId) => ({ userId: id, roleId })),
          skipDuplicates: true,
        });
      }
    }
    if (Array.isArray(businessIds)) {
      await prisma.businessAdmin.deleteMany({ where: { userId: id } });
      if (businessIds.length > 0) {
        await prisma.businessAdmin.createMany({
          data: businessIds.map((businessId) => ({ userId: id, businessId })),
          skipDuplicates: true,
        });
      }
    }
    const updated = await prisma.user.findUnique({
      where: { id },
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
    });
    return NextResponse.json(updated as UserWithRolesAndBusinesses);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
