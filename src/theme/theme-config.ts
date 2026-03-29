/**
 * Paleta “Te Llevo”: crema (#fff6e1), amarillo Material (#fdd400), texto oliva (#392e00).
 * Oscuro: superficies aceituna profunda, mismos acentos.
 */
export const themeConfig = {
  fontFamily: {
    /** Titulares (Plus Jakarta Sans vía next/font en --font-plus-jakarta) */
    primary:
      'var(--font-plus-jakarta), "Plus Jakarta Sans", system-ui, "Segoe UI", sans-serif',
    /** Cuerpo (Inter vía --font-inter) */
    secondary: 'var(--font-inter), Inter, system-ui, "Segoe UI", sans-serif',
  },
  palette: {
    common: {
      black: '#000000',
      white: '#ffffff',
    },
    /** Acentos espectrales (misma rampa en light/dark; se exponen en `theme.palette`). */
    pickerStripAccents: [
      '#fdd400',
      '#fae18c',
      '#ffe796',
      '#faf763',
      '#edd374',
      '#bfac6c',
      '#86763b',
      '#6d5a00',
    ] as const,
    light: {
      primary: {
        main: '#fdd400',
        light: '#ffe566',
        dark: '#c9a800',
        contrastText: '#594a00',
      },
      secondary: {
        main: '#6d5a00',
        light: '#86763b',
        dark: '#433700',
        contrastText: '#fff6e1',
      },
      background: {
        default: '#fff6e1',
        paper: '#ffffff',
      },
      text: {
        primary: '#392e00',
        secondary: '#695b23',
        disabled: 'rgba(57, 46, 0, 0.38)',
      },
      grey: {
        50: '#fafaf8',
        100: '#f5f5f0',
        200: '#eeeeea',
        300: '#e0e0d8',
        400: '#bdbdb5',
        500: '#9e9e94',
        600: '#75756a',
        700: '#616156',
        800: '#42423a',
        900: '#21211c',
      },
      error: { main: '#b02500' },
      warning: { main: '#f5dc81' },
      info: { main: '#008c72' },
      success: { main: '#2e7d32' },
    },
    dark: {
      primary: {
        main: '#fdd400',
        light: '#ffe566',
        dark: '#c9a800',
        contrastText: '#433700',
      },
      secondary: {
        main: '#bfac6c',
        light: '#f5dc81',
        dark: '#86763b',
        contrastText: '#130e00',
      },
      background: {
        default: '#130e00',
        paper: '#1f1908',
      },
      text: {
        primary: '#fff6e1',
        secondary: 'rgba(255, 246, 225, 0.72)',
        disabled: 'rgba(255, 246, 225, 0.38)',
      },
      grey: {
        50: '#2a2a26',
        100: '#363632',
        200: '#42423e',
        300: '#52524c',
        400: '#6e6e66',
        500: '#8a8a80',
        600: '#a0a094',
        700: '#b8b8ac',
        800: '#d0d0c4',
        900: '#e8e8dc',
      },
      error: { main: '#ef5350' },
      warning: { main: '#ff7043' },
      info: { main: '#00bfa5' },
      success: { main: '#00e676' },
    },
  },
} as const;

export type ThemeMode = 'light' | 'dark';
