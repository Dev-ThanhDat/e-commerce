/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'color-131921': '#131921',
        'color-3b4149': '#3b4149',
        'color-febd69': '#febd69',
        'color-232f3e': '#232f3e',
        'color-f5f5f7': '#f5f5f7',
        'color-ededed': '#ededed',
        'color-777777': '#777777',
        'color-bf4800': '#bf4800',
        'color-1c1c1b': '#1c1c1b'
      }
    },
    fontFamily: {
      manrope: ['Manrope', 'sans-serif'],
      Playwrite: ['Playwrite AU SA', 'sans-serif']
    }
  },
  plugins: []
};
