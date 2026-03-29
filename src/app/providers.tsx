'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { AppThemeProvider } from '@/theme';
import { AppShell } from '@/components/layouts/AppShell';
import { ModelProviders } from '@/contexts';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000 },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <ModelProviders>
            <AppShell>{children}</AppShell>
          </ModelProviders>
        </AppThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
