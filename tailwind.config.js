/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'navy': {
          50: '#E9E3FF',
          100: '#C0B8FE',
          200: '#A195FD',
          300: '#8171FC',
          400: '#7551FF',
          500: '#422AFB',
          600: '#3311DB',
          700: '#2111A5',
          800: '#190793',
          900: '#11047A',
        },
        'gray': {
          50: '#F5F6FA',
          100: '#E1E3EA',
          200: '#CACDD7',
          300: '#B0B4C2',
          400: '#989DB3',
          500: '#707EAE',
          600: '#585E7A',
          700: '#363C5F',
          800: '#2B3147',
          900: '#1B2559',
        },
      },
      boxShadow: {
        'design': '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
        'card': '0px 18px 40px rgba(112, 144, 176, 0.12)',
      },
    },
    fontFamily: {
      sans: ['DM Sans', 'sans-serif'],
    },
  },
  plugins: [],
};

