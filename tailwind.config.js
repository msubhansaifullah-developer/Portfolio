/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#09090B",
        panel: "#111116",
        card: "#16161D",
        line: "#27272A",
        mist: "#A1A1AA",
        paper: "#FAFAFA",
        accent: "#8B5CF6",
        signal: "#3B82F6",
      },
      fontFamily: {
        sans: ['"Outfit Variable"', "Outfit", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "ui-serif", "serif"],
      },
      boxShadow: {
        lift: "0 30px 70px -40px rgba(0,0,0,0.85)",
      },
    },
  },
  plugins: [],
};
