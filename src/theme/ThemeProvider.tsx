'use client';

import { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeModeProvider, useThemeMode } from './ThemeModeProvider';
import { createAppTheme } from './create-theme';

function InnerThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeModeProvider>
      <InnerThemeProvider>{children}</InnerThemeProvider>
    </ThemeModeProvider>
  );
}

export { useThemeMode } from './ThemeModeProvider';
