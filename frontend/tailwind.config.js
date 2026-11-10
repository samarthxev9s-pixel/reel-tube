/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yt: {
          dark: '#0f0f0f',
          gray: '#272727',
          light: '#3f3f3f',
          red: '#ff0000',
        }
      }
    },
  },
  plugins: [],
}
