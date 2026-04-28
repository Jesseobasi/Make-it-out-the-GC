/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
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
        // Dark mode colors
        dark: {
          bg: "#0f172a",
          surface: "#1e293b",
          border: "#334155",
          text: "#f1f5f9",
          muted: "#94a3b8",
        }
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
        "aurora-dark":
          "radial-gradient(circle at top left, rgba(249,115,22,0.15), transparent 32%), radial-gradient(circle at top right, rgba(15,118,110,0.12), transparent 30%), linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
      },
    },
  },
  plugins: [],
};

