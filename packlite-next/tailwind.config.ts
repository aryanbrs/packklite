// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--font-primary)"],
        secondary: ["var(--font-secondary)"],
      },
      colors: {
        primary: 'var(--primary-color)',
        secondary: 'var(--secondary-color)',
        dark: 'var(--dark-color)',
        light: 'var(--light-color)',
        'medium-gray': 'var(--medium-gray)',
        'light-gray': 'var(--light-gray)',
        danger: 'var(--danger-color)',
        warning: 'var(--warning-color)',
        success: 'var(--success-color)',
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
      },
    },
  },
  plugins: [],
};
export default config;