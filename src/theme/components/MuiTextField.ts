import { alpha, type Components, type Theme } from '@mui/material/styles';

export function getMuiTextFieldOverrides(theme: Theme): NonNullable<Components<Theme>['MuiTextField']> {
  return {
    styleOverrides: {
      root: {
        '&.TeLlevo-searchField .MuiOutlinedInput-root': {
          borderRadius: 999,
          backgroundColor: alpha(theme.palette.primary.main, 0.12),
          boxShadow: `inset 0 1px 2px ${alpha(theme.palette.common.black, 0.06)}`,
          '& fieldset': { border: 'none' },
          '&:hover fieldset': { border: 'none' },
          '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.35)}`,
          },
        },
        '&.TeLlevo-searchField .MuiInputAdornment-root .MuiSvgIcon-root': {
          color: theme.palette.text.secondary,
        },
      },
    },
  };
}
