module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FFD447',
        background: '#0f1422',
        surface: '#1a1f2e',
        foreground: '#ffffff',
        muted: '#8b95a5',
        success: '#76dba3',
        error: '#ff6b6b',
        warning: '#ffa94d',
        info: '#74c0fc',
      },
      fontFamily: {
        sans: ['System'],
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};
