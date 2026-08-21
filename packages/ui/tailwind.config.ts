import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "../../apps/customer/src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../apps/vendor/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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
          500: "#6ab864",
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
        background: "#F8F6F0",
        foreground: "#2D3748",
        surface: "#FFFFFF",
        "surface-hover": "#F8F7F4",
        border: "#E5E4DF",
        "border-strong": "#D4D2CB",
        primary: {
          DEFAULT: "#559650",
          hover: "#457841",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D4874D",
          hover: "#cb7233",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#DC3545",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#28A745",
          foreground: "#FFFFFF",
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
        "card-hover": "0 4px 12px 0 rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)",
        elevated: "0 8px 24px -4px rgba(0, 0, 0, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.04)",
        "bottom-nav": "0 -1px 6px 0 rgba(0, 0, 0, 0.06)",
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
        full: "9999px",
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
  plugins: [
    function ({ addUtilities }: { addUtilities: (u: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          display: 'none',
        },
      });
    },
  ],
};
export default config;
