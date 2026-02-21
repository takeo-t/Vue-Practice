/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // ここが重要です！
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}