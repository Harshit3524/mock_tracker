/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: "#2d1b2e",
        paper: "#fff5f7",
        accent: "#c9607a",
        gold: "#b87a5a",
        muted: "#9e7a85",
        surface: "#fce8ed",
        border: "#f0c8d4",
      },
    },
  },
  plugins: [],
};