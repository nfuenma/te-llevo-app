import type { Theme } from '@mui/material/styles';
import type { Components } from '@mui/material/styles';

export function getMuiChipOverrides(theme: Theme): NonNullable<Components<Theme>['MuiChip']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-promoFeaturedChip': {
          alignSelf: 'flex-start',
          marginBottom: theme.spacing(1.5),
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: 12,
        },
      },
    },
  };
}
