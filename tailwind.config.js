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
        background: "rgb(var(--background))",
        card: "rgb(var(--card))",
        foreground: "rgb(var(--foreground))",
        secondary: "rgb(var(--secondary))",
        primary: "rgb(var(--primary))",
      },
    },
  },
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: "#171717",
          },
        },
        light: {
          colors: {
            background: "#fafafa",
          },
        },
      },
    }),
  ],
};
