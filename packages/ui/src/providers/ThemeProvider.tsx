import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { colors as defaultColors, type ThemeColors } from '../theme/tokens';

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialDark?: boolean;
}

export function ThemeProvider({ children, initialDark = true }: ThemeProviderProps) {
  const [isDark, setIsDark] = useState(initialDark);

  const colors: ThemeColors = isDark
    ? defaultColors
    : {
        ...defaultColors,
        background: '#f5f5f5',
        surface: '#ffffff',
        foreground: '#0f1422',
        muted: '#6b7280',
      };

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
