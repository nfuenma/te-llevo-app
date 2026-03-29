import type { Theme } from '@mui/material/styles';
import type { Components } from '@mui/material/styles';

export function getMuiIconButtonOverrides(): NonNullable<Components<Theme>['MuiIconButton']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-appBarIcon': {
          color: 'primary.dark',
        },
      },
    },
  };
}
