/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0d12",
        surface: "#13161f",
        surfaceBorder: "#222736",
        surfaceHover: "#1b202e",
        accentMusic: "#a855f7",       // Purple
        accentFinance: "#f97316",     // Orange
        accentHousehold: "#10b981",   // Emerald/Green
        accentCyan: "#06b6d4",
        accentPink: "#ec4899",
        accentYellow: "#eab308",
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-spin': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
