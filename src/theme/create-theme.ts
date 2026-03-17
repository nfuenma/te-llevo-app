import { createTheme as muiCreateTheme } from '@mui/material/styles';
import { getPalette } from './core/palette';
import { typography } from './core/typography';
import { getComponents } from './core/components';
import { getCustomShadows } from './core/custom-shadows';
import { lightShadows, darkShadows } from './core/shadows';
import type { ThemeMode } from './theme-config';

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    xxl: 1800,
  },
};

export function createAppTheme(mode: ThemeMode) {
  const palette = getPalette(mode);
  const customShadows = getCustomShadows(mode);
  const shadows = mode === 'light' ? lightShadows : darkShadows;

  const baseTheme = muiCreateTheme({
    palette: { ...palette, mode },
    typography,
    shadows,
    shape: { borderRadius: 8 },
    breakpoints,
  });

  const themeWithShadows = { ...baseTheme, customShadows };

  const theme = muiCreateTheme(baseTheme, {
    components: getComponents(themeWithShadows),
  });

  return {
    ...theme,
    customShadows,
    breakpoints: {
      ...theme.breakpoints,
      values: breakpoints.values,
    },
  };
}
