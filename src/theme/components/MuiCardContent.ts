import type { Theme } from '@mui/material/styles';
import type { Components } from '@mui/material/styles';

export function getMuiCardContentOverrides(): NonNullable<Components<Theme>['MuiCardContent']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-catalogCardContent': {
          flexGrow: 1,
        },
      },
    },
  };
}
