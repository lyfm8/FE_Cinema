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
        ink: '#111111',
        charcoal: '#333333',
        stone: '#666666',
        fog: '#B4B2A9',
        ash: '#E5E7EB',
        cream: '#F9FAFB',
        paper: '#FFFFFF',
        gold: '#FACC15',
        'gold-dark': '#EAB308',
        rose: '#EF4444',
        'success-green': '#10B981',
        // Galaxy Cinema Theme Colors
        galaxyBlue: '#034ea2',
        galaxyOrange: '#f26b38',
        galaxyOrangeHover: '#fb9440',
        galaxyBg: '#fcfcfc',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Noto Serif', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        layout: '72rem',
      },
    },
  },
  plugins: [],
};
