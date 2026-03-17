import { PrismaClient } from '@prisma/client';

const ROLES = ['superadmin', 'admin', 'business', 'client'] as const;

const prisma = new PrismaClient();

async function main() {
  for (const name of ROLES) {
    await prisma.role.upsert({
      where: { name },
      create: { name },
      update: {},
    });
  }
  console.log('Roles creados: superadmin, admin, business, client');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
