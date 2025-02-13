/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'fluid': 'repeat(auto-fit, minmax(250px, 1fr))'
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-out',
        'zoom-hover': 'zoomHover 200ms ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        zoomHover: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.05)' }
        }
      }
    },
  },
  plugins: [],
}
