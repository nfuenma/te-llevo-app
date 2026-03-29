import { alpha, type Components, type Theme } from '@mui/material/styles';

export function getMuiFabOverrides(theme: Theme): NonNullable<Components<Theme>['MuiFab']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-promoSearchFab': {
          position: 'absolute',
          right: 20,
          bottom: 20,
          backgroundColor: theme.palette.common.white,
          color: theme.palette.primary.dark,
          pointerEvents: 'none',
          boxShadow:
            theme.palette.mode === 'light'
              ? `0 8px 20px ${alpha(theme.palette.common.black, 0.2)}`
              : `0 8px 20px ${alpha(theme.palette.common.black, 0.45)}`,
        },
      },
    },
  };
}
