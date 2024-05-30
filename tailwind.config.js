/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        base: 'rgba(149, 157, 165, 0.2) 2px 10px 30px',
      },
    },
  },
  plugins: [],
};
