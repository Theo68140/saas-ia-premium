import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0A0B12",
      },
      boxShadow: {
        glow: "0 0 80px rgba(61, 183, 255, 0.18)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 20% 20%, rgba(61,183,255,0.25), transparent 30%), radial-gradient(circle at 80% 15%, rgba(139,92,246,0.2), transparent 35%), radial-gradient(circle at 50% 85%, rgba(16,185,129,0.13), transparent 40%)",
      },
    },
  },
  plugins: [],
};

export default config;
