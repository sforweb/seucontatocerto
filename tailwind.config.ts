import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#105CC6",
          foreground: "hsl(var(--primary-foreground))",
          muted: "rgba(16, 92, 198, 0.1)",
        },
        secondary: {
          DEFAULT: "#46B2FF",
          foreground: "hsl(var(--secondary-foreground))",
          muted: "rgba(70, 178, 255, 0.1)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        light: {
          DEFAULT: "#E7EFF9",
          secondary: "#D2DDEC",
          tertiary: "#FFFFFF",
        },
        dark: {
          DEFAULT: "#1E1E1E",
        },
        status: {
          pending: "#F59E0B",
          inProgress: "#105CC6",
          completed: "#10B981",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-urbanist)"],
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(16, 92, 198, 0.08)",
        "card-hover": "0 10px 30px -4px rgba(16, 92, 198, 0.12)",
        elevated: "0 20px 25px -5px rgba(16, 92, 198, 0.05), 0 10px 10px -5px rgba(16, 92, 198, 0.02)",
        button: "0 2px 6px rgba(16, 92, 198, 0.25)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-pattern": "url('/patterns/hero-pattern.svg')",
        "dot-pattern": "url('/patterns/dot-pattern.svg')",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
