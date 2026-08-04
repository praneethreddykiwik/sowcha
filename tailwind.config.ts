import type { Config } from "tailwindcss";

/**
 * Every colour is a CSS variable holding an "R G B" triplet, so themes can be
 * swapped at runtime (see src/app/globals.css + ThemeProvider) while Tailwind
 * opacity modifiers such as `bg-primary/10` keep working.
 */
const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", xl: "2.5rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        background: withOpacity("--bg"),
        foreground: withOpacity("--fg"),
        muted: withOpacity("--muted"),
        primary: {
          DEFAULT: withOpacity("--primary"),
          soft: withOpacity("--primary-soft"),
          foreground: withOpacity("--primary-fg"),
        },
        ink: withOpacity("--ink"),
        secondary: withOpacity("--secondary"),
        accent: withOpacity("--accent"),
        card: withOpacity("--card"),
        border: withOpacity("--border"),
      },
      fontFamily: {
        serif: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.28em",
        wideish: "0.12em",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgb(var(--fg) / 0.03), 0 12px 32px -18px rgb(var(--fg) / 0.18)",
        lift: "0 2px 4px rgb(var(--fg) / 0.03), 0 32px 64px -28px rgb(var(--fg) / 0.28)",
        glass: "inset 0 1px 0 rgb(255 255 255 / 0.6), 0 18px 48px -28px rgb(var(--fg) / 0.35)",
      },
      transitionTimingFunction: {
        silk: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
        900: "900ms",
        1100: "1100ms",
        1200: "1200ms",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0) rotate(0deg)" },
          "50%": { transform: "translate3d(0,-18px,0) rotate(3deg)" },
        },
        drift: {
          "0%": { transform: "translate3d(0,0,0) rotate(0deg)", opacity: "0" },
          "10%, 80%": { opacity: "0.55" },
          "100%": { transform: "translate3d(60px,-140px,0) rotate(40deg)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        ripple: {
          from: { width: "0px", height: "0px", opacity: "0.25", transform: "translate(-50%,-50%)" },
          to: { width: "420px", height: "420px", opacity: "0", transform: "translate(-50%,-50%)" },
        },
      },
      animation: {
        float: "float 9s ease-in-out infinite",
        drift: "drift 18s linear infinite",
        shimmer: "shimmer 6s linear infinite",
        "fade-up": "fade-up 0.9s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
