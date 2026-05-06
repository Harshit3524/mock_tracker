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
        ink: "#0f0e0d",
        paper: "#f5f2eb",
        accent: "#e84a2e",
        gold: "#c9a84c",
        muted: "#8a8578",
        surface: "#edeae0",
        border: "#d4cfc4",
      },
    },
  },
  plugins: [],
};
