import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      colors: {
        /* ===== Marca ===== */
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "primary-light": "var(--color-primary-light)",

        secondary: "var(--color-secondary)",
        "secondary-dark": "var(--color-secondary-dark)",
        "secondary-light": "var(--color-secondary-light)",

        accent: "var(--color-accent)",
        "accent-dark": "var(--color-accent-dark)",

        border: "var(--color-border)",

        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",

        /* ===== SHADCN TOKENS (CLAVE) ===== */
        background: "var(--background)",
        foreground: "var(--foreground)",

        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",

        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",

        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",

        destructive: "var(--destructive)",

        ring: "var(--ring)",
        input: "var(--input)",

        sidebar: "var(--sidebar)",
        "sidebar-foreground": "var(--sidebar-foreground)",
        "sidebar-primary": "var(--sidebar-primary)",
        "sidebar-primary-foreground": "var(--sidebar-primary-foreground)",
        "sidebar-accent": "var(--sidebar-accent)",
        "sidebar-accent-foreground": "var(--sidebar-accent-foreground)",
        "sidebar-border": "var(--sidebar-border)",
        "sidebar-ring": "var(--sidebar-ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
      },
    },
  },
  plugins: [animate],
} satisfies Config;

export default config;

