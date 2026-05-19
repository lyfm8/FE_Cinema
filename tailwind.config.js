/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    borderWidth: {
      DEFAULT: '0.5px',
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
      base: '0.5px',
      selected: '1.5px',
    },
    extend: {
      colors: {
        ink: '#1A1A1A',
        charcoal: '#2C2C2A',
        stone: '#5F5E5A',
        fog: '#B4B2A9',
        ash: '#D3D1C7',
        cream: '#F1EFE8',
        paper: '#FAFAF8',
        gold: '#E8C547',
        'gold-dark': '#BA7517',
        rose: '#D4537E',
        'success-green': '#639922',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        layout: '72rem',
      },
    },
  },
  plugins: [],
};
