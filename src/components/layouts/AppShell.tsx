'use client';

import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import { ResponsiveAppBar } from '@/components/layouts/ResponsiveAppBar';
import { BottomNav } from '@/components/layouts/BottomNav';
import { TeLlevoClass } from '@/theme/teLlevoClasses';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ResponsiveAppBar />
      <Box component="main" className={TeLlevoClass.main}>
        {children}
      </Box>
      <BottomNav />
    </>
  );
}
