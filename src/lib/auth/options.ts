import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import { DEFAULT_ROLE, ROLES } from './roles';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  session: { strategy: 'database', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, user }) {
      if (!session.user) return session;
      session.user.id = user.id;
      session.user.roles = [];
      session.user.managedBusinessIds = [];

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          roles: { include: { role: true } },
          businessAdmins: { select: { businessId: true } },
        },
      });

      if (!dbUser) return session;

      const roleNames = dbUser.roles.map((ur) => ur.role.name);
      // Solo al primer login sin roles: únicamente el email en SUPERADMIN_EMAIL recibe superadmin; el resto recibe client.
      if (roleNames.length === 0) {
        const superadminEmail = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
        const isSuperadminEmail =
          superadminEmail !== undefined &&
          superadminEmail !== '' &&
          dbUser.email.toLowerCase() === superadminEmail;
        const roleToAssign = isSuperadminEmail ? ROLES.SUPERADMIN : DEFAULT_ROLE;
        const role = await prisma.role.findUnique({ where: { name: roleToAssign } });
        if (role) {
          await prisma.userRole.create({ data: { userId: user.id, roleId: role.id } });
          roleNames.push(roleToAssign);
        }
      }

      session.user.roles = roleNames;
      session.user.managedBusinessIds = dbUser.businessAdmins.map((ba) => ba.businessId);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
