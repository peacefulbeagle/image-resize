/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1120',
        surface: '#151F32',
        primary: '#38BDF8',
        success: '#10B981',
      }
    },
  },
  plugins: [],
}
