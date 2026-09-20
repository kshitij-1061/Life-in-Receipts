/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08040b",
        surface: "#12091c",
        surfaceBorder: "#2a153b",
        surfaceHover: "#1c0d2b",
        accentMusic: "#e066ff",
        accentFinance: "#f472b6",
        accentHousehold: "#c026d3",
        accentCyan: "#e879f9",
        accentPink: "#ec4899",
        accentYellow: "#f43f5e",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
