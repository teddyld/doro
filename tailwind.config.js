const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        foreground: "rgba(var(--foreground))",
        secondary: "rgba(var(--secondary))",
        primary: "rgba(var(--primary))",
        "primary-dark": "rgba(var(--primary-dark))",
      },
    },
  },
  plugins: [nextui()],
};
