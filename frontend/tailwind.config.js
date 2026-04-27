/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#f8fafc",
        tide: "#0f766e",
        sunrise: "#f97316",
        mellow: "#fbbf24",
        blush: "#f43f5e",
      },
      fontFamily: {
        sans: ["Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Iowan Old Style", "Palatino", "serif"],
      },
      boxShadow: {
        cloud: "0 24px 70px rgba(15, 23, 42, 0.13)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at top left, rgba(249,115,22,0.22), transparent 32%), radial-gradient(circle at top right, rgba(15,118,110,0.18), transparent 30%), linear-gradient(180deg, #fff7ed 0%, #f8fafc 58%, #e0f2fe 100%)",
      },
    },
  },
  plugins: [],
};

