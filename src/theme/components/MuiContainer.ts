import { type Components, type Theme } from '@mui/material/styles';

export function getMuiContainerOverrides(theme: Theme): NonNullable<Components<Theme>['MuiContainer']> {
  return {
    styleOverrides: {
      root: {
        paddingLeft: 16,
        paddingRight: 16,
        '&.TeLlevo-catalogPageContainer': {
          paddingInline: theme.spacing(2),
          paddingBlock: 0,
          [theme.breakpoints.up('sm')]: {
            paddingInline: theme.spacing(3),
            paddingBlock: theme.spacing(1),
          },
        },
        '&.TeLlevo-catalogPageContainerCompact': {
          paddingInline: theme.spacing(2),
          paddingBlock: theme.spacing(4),
        },
        '&.TeLlevo-catalogLayoutContainer': {
          paddingBlock: theme.spacing(3),
        },
      },
    },
  };
}
