import type { Theme } from '@mui/material/styles';
import type { Components } from '@mui/material/styles';

export function getMuiDividerOverrides(theme: Theme): NonNullable<Components<Theme>['MuiDivider']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-drawerDivider': {
          marginBlock: theme.spacing(1),
        },
      },
    },
  };
}
