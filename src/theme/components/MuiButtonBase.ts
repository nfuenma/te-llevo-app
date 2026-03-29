import { alpha, type Components, type Theme } from '@mui/material/styles';

export function getMuiButtonBaseOverrides(theme: Theme): NonNullable<Components<Theme>['MuiButtonBase']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-bottomNavAction': {
          flex: 1,
          borderRadius: theme.shape.borderRadius,
          paddingBlock: theme.spacing(0.75),
          flexDirection: 'column',
          gap: theme.spacing(0.25),
          color: theme.palette.text.secondary,
          backgroundColor: 'transparent',
          transition: theme.transitions.create(['background-color', 'transform'], {
            duration: theme.transitions.duration.shorter,
          }),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
          },
          '&[data-selected="true"]': {
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.main,
            transform: 'scale(1.02)',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.95),
            },
          },
        },
        '&.TeLlevo-regionItemHit': {
          borderRadius: theme.shape.borderRadius,
          display: 'block',
          textAlign: 'inherit',
          color: 'inherit',
        },
      },
    },
  };
}
