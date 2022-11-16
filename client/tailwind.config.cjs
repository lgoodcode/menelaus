/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        purple: {
          50: '#ececff',
          100: '#cacaeb',
          200: '#a6a6d8',
          300: '#8383c8',
          400: '#605fb7',
          500: '#47469e',
          600: '#36367b',
          700: '#272759',
          800: '#161737',
          900: '#070718',
        },
        lavender: {
          50: '#fdebfb',
          100: '#e8cae5',
          200: '#d7a9d1',
          300: '#c586bd',
          400: '#b365a9',
          500: '#9a4c90',
          600: '#793a71',
          700: '#572851',
          800: '#361831',
          900: '#160514',
        },
      },
    },
  },
  plugins: [],
}
