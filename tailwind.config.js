/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--bg) / <alpha-value>)",
        white: "rgb(var(--fg) / <alpha-value>)",
        // Live palette colors — updated continuously by <PaletteEngine />
        mt1: "rgb(var(--mt-1) / <alpha-value>)",
        mt2: "rgb(var(--mt-2) / <alpha-value>)",
        mt3: "rgb(var(--mt-3) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}
