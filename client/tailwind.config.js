/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#447A90',
        'primary-hover': '#62ACCC',
        dark: {
          'cont-m': '#2b2b2b',
          'text-prim': '#e0e0e0'
        },
        light: {
          'cont-s': '#ffffff',
          'text-prim': '#000000',
          'text-sec': '#444444'
        }
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}