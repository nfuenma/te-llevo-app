import type { PaletteOptions } from '@mui/material/styles';
import { themeConfig, type ThemeMode } from '../theme-config';

export function getPalette(mode: ThemeMode): PaletteOptions {
  const p = themeConfig.palette[mode];
  return {
    mode,
    common: themeConfig.palette.common,
    pickerStripAccents: [...themeConfig.palette.pickerStripAccents],
    primary: p.primary,
    secondary: p.secondary,
    error: p.error,
    warning: p.warning,
    info: p.info,
    success: p.success,
    background: p.background,
    text: p.text,
    grey: p.grey,
  };
}
