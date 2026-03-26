import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        ring: "hsl(var(--ring))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))"
      },
      boxShadow: {
        panel: "0 20px 60px rgba(8, 15, 28, 0.18)",
        glow: "0 10px 30px rgba(117, 157, 255, 0.14)"
      },
      borderRadius: {
        "2xl": "1.5rem",
        "3xl": "1.75rem"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "ui-sans-serif", "system-ui"]
      },
      backgroundImage: {
        mesh: "radial-gradient(circle at top, rgba(130, 162, 255, 0.18), transparent 30%), radial-gradient(circle at 80% 20%, rgba(145, 211, 190, 0.12), transparent 25%), linear-gradient(180deg, rgba(18, 24, 33, 0.96), rgba(11, 16, 24, 1))"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "1" }
        }
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        pulseLine: "pulseLine 1.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
