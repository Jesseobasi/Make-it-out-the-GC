/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        paper: "#f8fafc",
        mist: "#e2e8f0",
        coral: "#f97316",
        teal: "#0f766e",
        gold: "#fbbf24",
        rose: "#f43f5e",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(15, 23, 42, 0.12)",
      },
      fontFamily: {
        sans: ["Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Iowan Old Style", "Palatino", "serif"],
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top left, rgba(251,191,36,0.22), transparent 30%), radial-gradient(circle at top right, rgba(15,118,110,0.24), transparent 26%), linear-gradient(180deg, #fff7ed 0%, #f8fafc 60%, #eef2ff 100%)",
      },
    },
  },
  plugins: [],
};

