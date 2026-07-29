/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        heat: {
          50:      '#fff7ed',
          light:   '#1a0a00',
          DEFAULT: '#f97316',
          dark:    '#ea580c',
          700:     '#c2410c',
        },
        surface: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          hover:   'rgba(255,255,255,0.08)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float':      'float 4s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
