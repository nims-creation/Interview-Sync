/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          500: '#345a4a',
          600: '#345a4a',
          700: '#345a4a',
        },
        accent: {
          50: '#f5f3ff',
          500: '#50E3C2',
          600: '#50E3C2',
          700: '#50E3C2',
        },
        neutral: {
          50: '#FAF8F5',
          800: '#222d2d',
          900: '#181a1b',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        card: '#2c3a3a',
        inputBorder: '#4b6868',
        secondaryText: '#aebdc2',
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'button-hover': 'button-hover 0.3s ease-out',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.6)' },
        },
        'button-hover': {
          '0%': { transform: 'scale(1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
          '100%': { transform: 'scale(1.05)', boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};
