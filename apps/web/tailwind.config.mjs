/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          900: "rgb(var(--ink-900) / <alpha-value>)",
        },
        sand: {
          100: "rgb(var(--sand-100) / <alpha-value>)",
        },
        copper: {
          500: "rgb(var(--copper-500) / <alpha-value>)",
        },
        sage: {
          500: "rgb(var(--sage-500) / <alpha-value>)",
        },
        violet: {
          400: "rgb(var(--violet-400) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
