import type { TypographyVariantsOptions } from '@mui/material/styles';
import { themeConfig } from '../theme-config';

/**
 * Viewport range where font sizes interpolate linearly (px).
 * Alineado con móvil real (~360) hasta breakpoint `xl` del tema (1536).
 */
const fluidViewport = {
  minWidthPx: 360,
  maxWidthPx: 1536,
} as const;

/**
 * Tamaño fluido en rem: escala proporcional al ancho de pantalla entre min y max del viewport.
 * Fórmula: clamp(mín, interpolación lineal entre mín y Máx según 100vw, Máx).
 */
function fluidRem(minRem: number, maxRem: number): string {
  const { minWidthPx: minV, maxWidthPx: maxV } = fluidViewport;
  if (maxRem < minRem) {
    return fluidRem(maxRem, minRem);
  }
  if (maxV <= minV) {
    return `${maxRem}rem`;
  }
  const delta = maxRem - minRem;
  const range = maxV - minV;
  return `clamp(${minRem}rem, calc(${minRem}rem + (${delta}) * ((100vw - ${minV}px) / ${range}px)), ${maxRem}rem)`;
}

const ff = themeConfig.fontFamily.primary;

const variant = (fontSize: string) => ({
  fontFamily: ff,
  fontSize,
});

export const typography: TypographyVariantsOptions = {
  fontFamily: ff,
  h1: {
    ...variant(fluidRem(2, 3.5)),
    lineHeight: 1.15,
    fontWeight: 600,
  },
  h2: {
    ...variant(fluidRem(1.75, 2.75)),
    lineHeight: 1.2,
    fontWeight: 600,
  },
  h3: {
    ...variant(fluidRem(1.5, 2.25)),
    lineHeight: 1.25,
    fontWeight: 600,
  },
  h4: {
    ...variant(fluidRem(1.35, 2.125)),
    lineHeight: 1.235,
    fontWeight: 600,
  },
  h5: {
    ...variant(fluidRem(1.2, 1.5)),
    lineHeight: 1.334,
    fontWeight: 600,
  },
  h6: {
    ...variant(fluidRem(1.1, 1.25)),
    lineHeight: 1.4,
    fontWeight: 600,
  },
  subtitle1: {
    ...variant(fluidRem(1, 1.125)),
    lineHeight: 1.5,
  },
  subtitle2: {
    ...variant(fluidRem(0.875, 1)),
    lineHeight: 1.5,
    fontWeight: 500,
  },
  body1: {
    ...variant(fluidRem(0.9375, 1.0625)),
    lineHeight: 1.5,
  },
  body2: {
    ...variant(fluidRem(0.8125, 0.9375)),
    lineHeight: 1.43,
  },
  button: {
    ...variant(fluidRem(0.8125, 0.9375)),
    lineHeight: 1.75,
    fontWeight: 500,
    textTransform: 'none' as const,
  },
  caption: {
    ...variant(fluidRem(0.75, 0.8125)),
    lineHeight: 1.4,
  },
  overline: {
    ...variant(fluidRem(0.625, 0.75)),
    lineHeight: 2,
    fontWeight: 500,
    textTransform: 'uppercase' as const,
  },
};
