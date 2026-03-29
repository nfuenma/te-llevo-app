import type { Theme } from '@mui/material/styles';
import type { Components } from '@mui/material/styles';

export function getMuiButtonOverrides(theme: Theme): NonNullable<Components<Theme>['MuiButton']> {
  return {
    variants: [
      {
        props: { variant: 'catalogLink' },
        style: {
          color: theme.palette.text.secondary,
          fontWeight: 700,
          minWidth: 'auto',
          paddingInline: theme.spacing(1),
        },
      },
    ],
    styleOverrides: {
      root: {
        textTransform: 'none' as const,
      },
    },
  };
}
