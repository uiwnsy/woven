/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-manrope)', 'Pretendard Variable', 'Pretendard', '-apple-system', 'sans-serif'],
      },
      colors: {
        iris: {
          50: '#eeeeff',
          100: '#e0e1fc',
          200: '#c4c6f9',
          300: '#a5a8f5',
          400: '#8486f3',
          500: '#6366f1',
          600: '#4f52e0',
          900: '#1e2075'
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f3',
          200: '#e8e7e4',
          300: '#d4d2ce',
          400: '#b0ada7',
          500: '#78756e',
          600: '#5c5a54',
          800: '#2e2c28',
          900: '#1c1a17'
        },
        peach: {
          50: '#fef6f1',
          100: '#fdeae0',
          300: '#f7b898',
          500: '#ef8652'
        },
        success: {
          bg: '#f0fdf4',
          border: '#86efac',
          text: '#166534'
        },
        warning: {
          bg: '#fffbeb',
          text: '#92400e'
        },
        bluegray: '#f0f2f8'
      }
    },
  },
  plugins: [],
}
