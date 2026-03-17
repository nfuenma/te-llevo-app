import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { isSuperadmin } from '@/lib/auth/roles';

export default async function AdminUsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !isSuperadmin(session.user.roles)) {
    redirect('/admin');
  }
  return <>{children}</>;
}
