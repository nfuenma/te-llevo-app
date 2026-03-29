'use client';

import { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeModeProvider, useThemeMode } from './ThemeModeProvider';
import { createAppTheme } from './create-theme';
import { getTeLlevoGlobalClassStyles } from './teLlevoGlobalClassStyles';

function InnerThemeProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useThemeMode();
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={getTeLlevoGlobalClassStyles(theme)} />
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
