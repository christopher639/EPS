/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode using the 'dark' class
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
