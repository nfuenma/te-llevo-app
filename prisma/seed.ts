import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const ROLES = ['superadmin', 'admin', 'business', 'client'] as const;

type SeedData = {
  roles: Array<{ id: string; name: string }>;
  users: Array<Record<string, unknown>>;
  accounts: Array<Record<string, unknown>>;
  sessions: Array<Record<string, unknown>>;
  userRoles: Array<{ userId: string; roleId: string }>;
  regions: Array<Record<string, unknown>>;
  categories: Array<Record<string, unknown>>;
  businesses: Array<Record<string, unknown>>;
  businessCategories: Array<{ businessId: string; categoryId: string }>;
  regionCategories: Array<{ regionId: string; categoryId: string }>;
  productCategories: Array<Record<string, unknown>>;
  products: Array<Record<string, unknown>>;
  categoryProducts: Array<{ productId: string; categoryId: string }>;
  productProductCategories: Array<{ productId: string; productCategoryId: string }>;
  businessAdmins: Array<{ userId: string; businessId: string }>;
};

function toDate(v: unknown): Date | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string') return new Date(v);
  if (v instanceof Date) return v;
  return undefined;
}

function toDecimal(v: unknown): string | number | undefined {
  if (v == null) return undefined;
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string') return v;
  return undefined;
}

async function main() {
  const seedPath = path.join(__dirname, 'seed-data.json');
  if (!fs.existsSync(seedPath)) {
    for (const name of ROLES) {
      await prisma.role.upsert({
        where: { name },
        create: { name },
        update: {},
      });
    }
    console.log('Roles: superadmin, admin, business, client (sin seed-data.json)');
    console.log('Para exportar la DB actual: npx tsx prisma/export-seed-data.ts');
    return;
  }

  const raw = JSON.parse(fs.readFileSync(seedPath, 'utf-8')) as SeedData;
  const data = {
    roles: raw.roles ?? [],
    users: raw.users ?? [],
    accounts: raw.accounts ?? [],
    sessions: raw.sessions ?? [],
    userRoles: raw.userRoles ?? [],
    regions: raw.regions ?? [],
    categories: raw.categories ?? [],
    businesses: raw.businesses ?? [],
    businessCategories: raw.businessCategories ?? [],
    regionCategories: raw.regionCategories ?? [],
    productCategories: raw.productCategories ?? [],
    products: raw.products ?? [],
    categoryProducts: raw.categoryProducts ?? [],
    productProductCategories: raw.productProductCategories ?? [],
    businessAdmins: raw.businessAdmins ?? [],
  };

  // 1) Roles (con IDs exportados para que userRoles coincida)
  if (data.roles.length > 0) {
    await prisma.role.createMany({
      data: data.roles.map((r) => ({ id: r.id, name: r.name })),
      skipDuplicates: true,
    });
    console.log('Roles:', data.roles.length);
  } else {
    for (const name of ROLES) {
      await prisma.role.upsert({
        where: { name },
        create: { name },
        update: {},
      });
    }
    console.log('Roles: 4 (upsert por nombre)');
  }

  // 2) Resto en orden (respetando FKs). createMany con skipDuplicates.
  if (data.users.length > 0) {
    await prisma.user.createMany({
      data: data.users.map((u) => ({
        id: u.id as string,
        name: (u.name as string) ?? null,
        lastname: (u.lastname as string) ?? null,
        typeIdentification: (u.typeIdentification as string) ?? null,
        identification: (u.identification as string) ?? null,
        email: u.email as string,
        emailVerified: toDate(u.emailVerified) ?? null,
        image: (u.image as string) ?? null,
        address: (u.address as string) ?? null,
        phone: (u.phone as string) ?? null,
        createdAt: toDate(u.createdAt) ?? new Date(),
        updatedAt: toDate(u.updatedAt) ?? new Date(),
      })),
      skipDuplicates: true,
    });
    console.log('Users:', data.users.length);
  }

  if (data.accounts.length > 0) {
    await prisma.account.createMany({
      data: data.accounts.map((a) => ({
        userId: a.userId as string,
        type: a.type as string,
        provider: a.provider as string,
        providerAccountId: a.providerAccountId as string,
        refresh_token: (a.refresh_token as string) ?? null,
        access_token: (a.access_token as string) ?? null,
        expires_at: (a.expires_at as number) ?? null,
        token_type: (a.token_type as string) ?? null,
        scope: (a.scope as string) ?? null,
        id_token: (a.id_token as string) ?? null,
        session_state: (a.session_state as string) ?? null,
      })),
      skipDuplicates: true,
    });
    console.log('Accounts:', data.accounts.length);
  }

  if (data.sessions.length > 0) {
    await prisma.session.createMany({
      data: data.sessions.map((s) => ({
        sessionToken: s.sessionToken as string,
        userId: s.userId as string,
        expires: toDate(s.expires) ?? new Date(),
      })),
      skipDuplicates: true,
    });
    console.log('Sessions:', data.sessions.length);
  }

  if (data.userRoles.length > 0) {
    await prisma.userRole.createMany({
      data: data.userRoles,
      skipDuplicates: true,
    });
    console.log('UserRoles:', data.userRoles.length);
  }

  if (data.regions.length > 0) {
    await prisma.region.createMany({
      data: data.regions.map((r) => ({
        id: r.id as string,
        name: r.name as string,
        image: (r.image as string) ?? null,
        createdAt: toDate(r.createdAt) ?? new Date(),
        updatedAt: toDate(r.updatedAt) ?? new Date(),
      })),
      skipDuplicates: true,
    });
    console.log('Regions:', data.regions.length);
  }

  if (data.categories.length > 0) {
    await prisma.category.createMany({
      data: data.categories.map((c) => ({
        id: c.id as string,
        name: c.name as string,
        tags: Array.isArray(c.tags) ? (c.tags as string[]) : [],
        image: (c.image as string) ?? null,
        createdAt: toDate(c.createdAt) ?? new Date(),
        updatedAt: toDate(c.updatedAt) ?? new Date(),
      })),
      skipDuplicates: true,
    });
    console.log('Categories:', data.categories.length);
  }

  if (data.businesses.length > 0) {
    await prisma.business.createMany({
      data: data.businesses.map((b) => ({
        id: b.id as string,
        name: b.name as string,
        slug: b.slug as string,
        description: (b.description as string) ?? null,
        address: (b.address as string) ?? null,
        image: (b.image as string) ?? null,
        createdAt: toDate(b.createdAt) ?? new Date(),
        updatedAt: toDate(b.updatedAt) ?? new Date(),
      })),
      skipDuplicates: true,
    });
    console.log('Businesses:', data.businesses.length);
  }

  if (data.businessCategories.length > 0) {
    await prisma.businessCategory.createMany({
      data: data.businessCategories,
      skipDuplicates: true,
    });
    console.log('BusinessCategories:', data.businessCategories.length);
  }

  if (data.regionCategories.length > 0) {
    await prisma.regionCategory.createMany({
      data: data.regionCategories,
      skipDuplicates: true,
    });
    console.log('RegionCategories:', data.regionCategories.length);
  }

  if (data.productCategories.length > 0) {
    await prisma.productCategory.createMany({
      data: data.productCategories.map((pc) => ({
        id: pc.id as string,
        businessId: pc.businessId as string,
        name: pc.name as string,
        image: (pc.image as string) ?? null,
        createdAt: toDate(pc.createdAt) ?? new Date(),
        updatedAt: toDate(pc.updatedAt) ?? new Date(),
      })),
      skipDuplicates: true,
    });
    console.log('ProductCategories:', data.productCategories.length);
  }

  if (data.products.length > 0) {
    await prisma.product.createMany({
      data: data.products.map((p) => ({
        id: p.id as string,
        businessId: p.businessId as string,
        name: p.name as string,
        description: (p.description as string) ?? null,
        price: toDecimal(p.price),
        image: (p.image as string) ?? null,
        createdAt: toDate(p.createdAt) ?? new Date(),
        updatedAt: toDate(p.updatedAt) ?? new Date(),
      })),
      skipDuplicates: true,
    });
    console.log('Products:', data.products.length);
  }

  if (data.categoryProducts.length > 0) {
    await prisma.categoryProduct.createMany({
      data: data.categoryProducts,
      skipDuplicates: true,
    });
    console.log('CategoryProducts:', data.categoryProducts.length);
  }

  if (data.productProductCategories.length > 0) {
    await prisma.productProductCategory.createMany({
      data: data.productProductCategories,
      skipDuplicates: true,
    });
    console.log('ProductProductCategories:', data.productProductCategories.length);
  }

  if (data.businessAdmins.length > 0) {
    await prisma.businessAdmin.createMany({
      data: data.businessAdmins,
      skipDuplicates: true,
    });
    console.log('BusinessAdmins:', data.businessAdmins.length);
  }

  console.log('Seed completado.');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
