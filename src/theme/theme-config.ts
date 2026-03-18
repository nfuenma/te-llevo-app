/**
 * Paleta basada en:
 * - Principal: #ffd200 (amarillo/dorado)
 * - Secundarios: #ff5200 (naranja), #ffd200, #2dff00 (verde), #00ff52 (verde menta)
 * Light: fondos claros, texto oscuro, colores vivos.
 * Dark: fondos oscuros, texto claro, mismos acentos con buen contraste.
 */
export const themeConfig = {
  fontFamily: {
    primary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    secondary: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    common: {
      black: '#000000',
      white: '#ffffff',
    },
    light: {
      primary: {
        main: '#ffd200',
        light: '#ffe566',
        dark: '#cca300',
        contrastText: '#1a1a00',
      },
      secondary: {
        main: '#ff5200',
        light: '#ff7a33',
        dark: '#cc4200',
        contrastText: '#ffffff',
      },
      background: {
        default: '#fafaf5',
        paper: '#ffffff',
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)',
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
      error: { main: '#c62828' },
      warning: { main: '#ff5200' },
      info: { main: '#008c72' },
      success: { main: '#00b84a' },
    },
    dark: {
      primary: {
        main: '#ffd200',
        light: '#ffe566',
        dark: '#e6bd00',
        contrastText: '#1a1a00',
      },
      secondary: {
        main: '#ff5200',
        light: '#ff7a33',
        dark: '#e64a00',
        contrastText: '#ffffff',
      },
      background: {
        default: '#121210',
        paper: '#1e1e1a',
      },
      text: {
        primary: '#f5f5f0',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
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
