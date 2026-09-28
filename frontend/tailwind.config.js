/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#EBE7DE',
        ink: '#181818',
        charcoal: '#1C1C1C',
        slate: '#252525',
        stone: '#D9CBAA',
        clay: '#B08D6D',
        gold: '#C5A265',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
