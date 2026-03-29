import type { Theme } from '@mui/material/styles';
import type { Components } from '@mui/material/styles';

export function getMuiCardMediaOverrides(theme: Theme): NonNullable<Components<Theme>['MuiCardMedia']> {
  return {
    styleOverrides: {
      root: {
        objectFit: 'cover',
        '&.TeLlevo-promoHeroMedia': {
          height: 260,
          [theme.breakpoints.up('sm')]: {
            height: 300,
          },
        },
      },
    },
  };
}
