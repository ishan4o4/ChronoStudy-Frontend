/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      },
      colors: {
        neon: {
          pink: "#ff4ecd",
          blue: "#38bdf8",
          lime: "#a3e635"
        }
      },
      backgroundImage: {
        "neo-grid":
          "radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.3) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};
