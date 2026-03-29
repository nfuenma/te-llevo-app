import { alpha, type Components, type Theme } from '@mui/material/styles';

export function getMuiAvatarOverrides(theme: Theme): NonNullable<Components<Theme>['MuiAvatar']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-regionAvatar': {
          width: 72,
          height: 72,
          boxSizing: 'border-box',
          border: '3px solid transparent',
          fontWeight: 800,
          color: theme.palette.primary.dark,
          backgroundColor: alpha(theme.palette.primary.main, 0.2),
          '&:has(.MuiAvatar-img)': {
            backgroundColor: 'transparent',
          },
          '&[data-selected="true"]': {
            borderColor: theme.palette.primary.main,
          },
        },
      },
    },
  };
}
