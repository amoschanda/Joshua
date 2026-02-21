export const colors = {
  primary: '#FFD447',
  background: '#0f1422',
  surface: '#1a1f2e',
  foreground: '#ffffff',
  muted: '#8b95a5',
  success: '#76dba3',
  error: '#ff6b6b',
  warning: '#ffa94d',
  info: '#74c0fc',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type ThemeColors = typeof colors;
export type ThemeSpacing = typeof spacing;
export type ThemeBorderRadius = typeof borderRadius;
export type ThemeFontSize = typeof fontSize;
