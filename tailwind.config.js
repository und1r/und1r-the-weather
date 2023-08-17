/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'iss-background': '#020513',
      },
      backgroundColor: {
        'iss-background': '#020513',
      },
    },
  },
  plugins: [],
};
