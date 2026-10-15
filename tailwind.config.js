/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#dbecff',
          200: '#bedeff',
          300: '#91c9ff',
          400: '#5dabff',
          500: '#3a8aff',
          600: '#246bf5',
          700: '#1b54e0',
          800: '#1c44b6',
          900: '#1d3c8f',
        },
      },
    },
  },
  plugins: [],
};
