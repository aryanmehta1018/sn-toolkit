/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        display: ['Cal Sans', 'Inter var', 'system-ui', 'sans-serif'],
      },
      colors: {
        // SN Toolkit palette — slate-based dark with electric violet accent
        surface: {
          DEFAULT: '#0D0E14',
          1: '#13141C',
          2: '#1A1C26',
          3: '#21232F',
          4: '#282B39',
        },
        border: {
          DEFAULT: '#2A2D3E',
          focus: '#6366F1',
        },
        violet: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        electric: '#6366F1',
        'electric-light': '#818CF8',
        'electric-glow': 'rgba(99,102,241,0.15)',
      },
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M0 40L40 0M-5 5L5 -5M35 45L45 35' stroke='%232A2D3E' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
