/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        morado: "#7e22ce",
        naranja: "#f97316",
        verde: "#22c55e",
        oscuro: "#111827",
      },
      fontFamily: {
        body: ["Poppins", "sans-serif"],
        titulo: ["Cinzel Decorative", "serif"],
      },
    },
  },
  plugins: [],
}
