/**
 * Exporta los datos actuales de la DB a prisma/seed-data.json.
 * Ejecutar una vez con la DB que quieras usar como base del seed:
 *   npx tsx prisma/export-seed-data.ts
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function serialize(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'object' && obj !== null && 'toNumber' in obj) {
    return (obj as { toNumber: () => number }).toNumber();
  }
  if (obj instanceof Date) return obj.toISOString();
  if (Array.isArray(obj)) return obj.map(serialize);
  if (typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) out[k] = serialize(v);
    return out;
  }
  return obj;
}

async function main() {
  const [roles, users, accounts, sessions, userRoles, regions, categories, businesses, businessCategories, regionCategories, productCategories, products, categoryProducts, productProductCategories, businessAdmins] =
    await Promise.all([
      prisma.role.findMany(),
      prisma.user.findMany(),
      prisma.account.findMany(),
      prisma.session.findMany(),
      prisma.userRole.findMany(),
      prisma.region.findMany(),
      prisma.category.findMany(),
      prisma.business.findMany(),
      prisma.businessCategory.findMany(),
      prisma.regionCategory.findMany(),
      prisma.productCategory.findMany(),
      prisma.product.findMany(),
      prisma.categoryProduct.findMany(),
      prisma.productProductCategory.findMany(),
      prisma.businessAdmin.findMany(),
    ]);

  const data = {
    roles: serialize(roles),
    users: serialize(users),
    accounts: serialize(accounts),
    sessions: serialize(sessions),
    userRoles: serialize(userRoles),
    regions: serialize(regions),
    categories: serialize(categories),
    businesses: serialize(businesses),
    businessCategories: serialize(businessCategories),
    regionCategories: serialize(regionCategories),
    productCategories: serialize(productCategories),
    products: serialize(products),
    categoryProducts: serialize(categoryProducts),
    productProductCategories: serialize(productProductCategories),
    businessAdmins: serialize(businessAdmins),
  };

  const outPath = path.join(__dirname, 'seed-data.json');
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Datos exportados a prisma/seed-data.json');
  console.log('Resumen:', {
    roles: roles.length,
    users: users.length,
    accounts: accounts.length,
    sessions: sessions.length,
    userRoles: userRoles.length,
    regions: regions.length,
    categories: categories.length,
    businesses: businesses.length,
    businessCategories: businessCategories.length,
    regionCategories: regionCategories.length,
    productCategories: productCategories.length,
    products: products.length,
    categoryProducts: categoryProducts.length,
    productProductCategories: productProductCategories.length,
    businessAdmins: businessAdmins.length,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
