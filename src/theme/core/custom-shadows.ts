import type { ThemeMode } from '../theme-config';

export type CustomShadows = {
  z1: string;
  z8: string;
  z12: string;
  z16: string;
  z20: string;
  z24: string;
};

const lightCustom: CustomShadows = {
  z1: '0px 1px 2px rgba(0,0,0,0.08)',
  z8: '0px 8px 16px rgba(0,0,0,0.12)',
  z12: '0px 12px 24px rgba(0,0,0,0.12)',
  z16: '0px 16px 32px rgba(0,0,0,0.14)',
  z20: '0px 20px 40px rgba(0,0,0,0.14)',
  z24: '0px 24px 48px rgba(0,0,0,0.16)',
};

const darkCustom: CustomShadows = {
  z1: '0px 1px 2px rgba(0,0,0,0.4)',
  z8: '0px 8px 16px rgba(0,0,0,0.4)',
  z12: '0px 12px 24px rgba(0,0,0,0.45)',
  z16: '0px 16px 32px rgba(0,0,0,0.45)',
  z20: '0px 20px 40px rgba(0,0,0,0.5)',
  z24: '0px 24px 48px rgba(0,0,0,0.5)',
};

export function getCustomShadows(mode: ThemeMode): CustomShadows {
  return mode === 'light' ? lightCustom : darkCustom;
}
