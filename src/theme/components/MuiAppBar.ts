import { alpha, type Components, type Theme } from '@mui/material/styles';

export function getMuiAppBarOverrides(theme: Theme): NonNullable<Components<Theme>['MuiAppBar']> {
  return {
    styleOverrides: {
      root: {
        boxShadow: theme.customShadows?.z1 ?? 'none',
        '&.TeLlevo-catalogAppBar': {
          backgroundColor: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.86 : 0.9
          ),
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          boxShadow: 'none',
        },
      },
    },
  };
}
