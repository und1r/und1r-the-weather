/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      spacing: {
        '1/6': '16.66%',
      },
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
