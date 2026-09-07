import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FBFAF7",
          surface: "#FFFFFF",
          line: "#E4E1D8",
        },
        ink: "#171A21",
        turtle: {
          blue: "#2B34DE",
          green: "#1C8A4B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};

export default config;
