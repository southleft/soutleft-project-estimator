/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F0F0F',
        accent: '#f05735',
        text: '#faf9f8',
      },
      boxShadow: {
        glow: '0 0 20px rgba(240, 87, 53, 0.15)',
      },
      screens: {
        'custom': '800px',
      },
    },
  },
  plugins: [],
};
