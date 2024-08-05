module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable dark mode with a class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inconsolata', 'monospace'],
      },
      colors: {
        cream: {
          light: '#FFFDE7', // Light cream color
          DEFAULT: '#FFF8E1', // Default cream color
          dark: '#FFECB3', // Darker cream color
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
