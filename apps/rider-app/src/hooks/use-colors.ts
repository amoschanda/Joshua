import { Colors, type ColorScheme, type ThemeColorPalette } from '@/lib/theme';
import { useThemeContext } from '@/lib/theme-provider';

export function useColors(colorSchemeOverride?: ColorScheme): ThemeColorPalette {
  const { colorScheme } = useThemeContext();
  const scheme = (colorSchemeOverride ?? colorScheme ?? 'dark') as ColorScheme;
  return Colors[scheme];
}
