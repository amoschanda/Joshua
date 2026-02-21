import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',
  isDark: true,
  setTheme: (theme) =>
    set({
      theme,
      isDark: theme === 'dark' || (theme === 'system' && true),
    }),
}));
