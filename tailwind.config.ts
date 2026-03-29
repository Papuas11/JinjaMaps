import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d8eaff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8"
        }
      },
      boxShadow: {
        panel: "0 16px 45px -20px rgba(15, 23, 42, 0.28)",
        card: "0 10px 25px -15px rgba(15, 23, 42, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
