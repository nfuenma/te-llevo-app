import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { canAccessAdminPanel } from '@/lib/auth/roles';
import { AdminShell } from '@/components/layouts/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/admin');
  }
  if (!canAccessAdminPanel(session.user.roles)) {
    redirect('/');
  }
  return (
    <AdminShell
      roles={session.user.roles}
      managedBusinessIds={session.user.managedBusinessIds}
    >
      {children}
    </AdminShell>
  );
}
