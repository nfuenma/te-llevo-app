import type { Theme } from '@mui/material/styles';
import type { Components } from '@mui/material/styles';

export function getMuiSvgIconOverrides(): NonNullable<Components<Theme>['MuiSvgIcon']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-bottomNavIcon': {
          fontSize: 24,
        },
      },
    },
  };
}
