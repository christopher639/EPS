/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.page-break': {
          '@media print': {
            'page-break-after': 'always',
            'break-after': 'page',
          },
        },
      });
    },
  ],
}


