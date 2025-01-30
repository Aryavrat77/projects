import { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const tailwindConfig: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.75rem" }],
      lg: ["1.125rem", { lineHeight: "2rem" }],
      xl: ["1.25rem", { lineHeight: "2rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["2rem", { lineHeight: "2.5rem" }],
      "4xl": ["2.5rem", { lineHeight: "3.5rem" }],
      "5xl": ["3rem", { lineHeight: "3.5rem" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1.1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    extend: {
      borderRadius: {
        "4xl": "2rem",
      },
      // colors: {
      //   'dashboard-bg': '#ADD8E6',  
      //   'card-bg': '#4B5563',
      //   'card-text': '#D1D5DB',
      // },
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        display: ["Lexend", ...fontFamily.sans],
      },
      maxWidth: {
        md: "40rem",
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/aspect-ratio')],
};

export default tailwindConfig;
