import { colors } from "./src/theme/colors";
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors:colors
    // extend: {
    //   colors: {
    //     primary: "#0e3b5a",
    //   },
    // },
  },
  plugins: [],
};
export default config;
