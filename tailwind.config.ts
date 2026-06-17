import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4eb",
          100: "#d9e8d0",
          200: "#bddcb5",
          300: "#a1d09a",
          400: "#85c47f",
          500: "#6ab864",  // Muted Basil Green (#8A9A5B adjusted for better accessibility)
          600: "#559650",
          700: "#457841",
          800: "#365b33",
          900: "#2a4326",
          950: "#1e2e1a",
        },
        copper: {
          50: "#fdf6ef",
          100: "#faead9",
          200: "#f4d2b1",
          300: "#edb47f",
          400: "#D4874D",
          500: "#cb7233",
          600: "#bd5c28",
          700: "#9d4623",
          800: "#7e3922",
          900: "#67311e",
        },
        neutral: {
          50: "#F8F7F4",
          100: "#F1F0EC",
          200: "#E5E4DF",
          300: "#D4D2CB",
          400: "#B0ADA3",
          500: "#918D82",
          600: "#767268",
          700: "#605D55",
          800: "#514E48",
          900: "#464440",
          950: "#262422",
        },
        background: {
          50: "#F8F6F0",  // Warm White
        },
        foreground: {
          50: "#2D3748",  // Charcoal Gray
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03)",
        "card-hover":
          "0 4px 12px 0 rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
        elevated:
          "0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.04)",
        "bottom-nav": "0 -1px 6px 0 rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-in-right": "slideInRight 0.25s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(12px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
