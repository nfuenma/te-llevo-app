import type { CustomShadows } from './core/custom-shadows';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }
  interface ThemeOptions {
    customShadows?: CustomShadows;
  }

  interface Palette {
    /** Acentos espectrales por posición (pickers horizontales, etc.). */
    pickerStripAccents: string[];
  }
  interface PaletteOptions {
    pickerStripAccents?: string[];
  }
}
