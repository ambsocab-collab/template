import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Design system standard
        'brand-primary': '#6c47ff', // Primary brand purple
        'brand-secondary': '#f0f4ff', // Light purple for backgrounds
        'ceramic-white': '#ffffff', // White text and elements
        // Extend with semantic color names for consistency
        primary: '#6c47ff',
      },
    },
  },
  plugins: [],
};

export default config;
