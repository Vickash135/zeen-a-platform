/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF4FF',
          100: '#D1E8FF',
          200: '#A3CFFF',
          300: '#75B6FF',
          400: '#479DFF',
          500: '#1A84FF',
          600: '#0066CC',
          700: '#004D99',
          800: '#003366',
          900: '#001A33',
        },
      },
    },
  },
  plugins: [],
}