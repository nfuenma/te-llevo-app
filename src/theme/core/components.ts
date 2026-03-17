import type { Components, Theme } from '@mui/material/styles';

export function getComponents(theme: Theme): Components<Theme> {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: theme.customShadows?.z1 ?? 'none',
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
        },
      },
    },
  };
}
