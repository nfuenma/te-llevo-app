import type { Theme } from '@mui/material/styles';
import type { Components } from '@mui/material/styles';

export function getMuiToolbarOverrides(theme: Theme): NonNullable<Components<Theme>['MuiToolbar']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-catalogToolbar': {
          minHeight: 64,
          paddingInline: theme.spacing(2),
          maxWidth: 1200,
          width: '100%',
          marginInline: 'auto',
          justifyContent: 'space-between',
          [theme.breakpoints.up('sm')]: {
            minHeight: 72,
            paddingInline: theme.spacing(3),
          },
        },
      },
    },
  };
}
