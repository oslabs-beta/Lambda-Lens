/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Element colors
        'element-h': '#62ACCC',
        'element-s': '#447A90',

        // Light mode colors
        'light-cont-l': '#ffffff',
        'light-cont-m': '#f3f3f3',
        'light-cont-s': '#e1e1e1',
        'light-text-prim': '#161616',
        'light-text-sec': '#646464',

        // Dark mode colors
        'dark-bg': '#121212', 
        'dark-cont-l': '#1e1e1e',
        'dark-cont-m': '#2a2a2a',
        'dark-cont-s': '#363636',
        'dark-text-prim': '#ffffff',
        'dark-text-sec': '#a2a2a2',

        // Misc
        'error': '#d25d23',
        primary: '#447A90',
        'primary-hover': '#62ACCC',
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'mui-2': '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  darkMode: 'selector',
  plugins: [],
  corePlugins: {
    preflight: true,
  }
}