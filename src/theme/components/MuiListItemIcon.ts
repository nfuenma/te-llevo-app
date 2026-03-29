import type { Theme } from '@mui/material/styles';
import type { Components } from '@mui/material/styles';

export function getMuiListItemIconOverrides(theme: Theme): NonNullable<Components<Theme>['MuiListItemIcon']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-drawerListItemIcon': {
          minWidth: 0,
          marginRight: theme.spacing(1.5),
          color: 'inherit',
        },
      },
    },
  };
}
