import type { Config } from "tailwindcss";
import baseConfig from "@sokopay/ui/tailwind";

const config: Config = {
  ...baseConfig,
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;
