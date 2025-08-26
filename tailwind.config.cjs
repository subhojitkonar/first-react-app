/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{ts,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0f1115',
          primary: '#2563eb',
          primaryHover: '#1d4ed8'
        }
      },
      fontFamily: {
        sans: ['system-ui','Arial','sans-serif']
      },
      boxShadow: {
        soft: '0 2px 4px rgba(0,0,0,0.15)'
      },
      maxWidth: {
        content: '640px'
      },
      container: {
        center: true,
        padding: '1rem'
      }
    }
  },
  plugins: []
};