import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'purple-primary': '#8b5cf6',
        'purple-secondary': '#a78bfa',
        'purple-dark': '#6d28d9',
        'purple-light': '#c4b5fd',
        background: '#0f0c29',
        foreground: '#e9d5ff',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        'gradient-text': 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
        'gradient-button': 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 12px 32px rgba(139, 92, 246, 0.4), 0 0 40px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'purple-glow': '0 4px 15px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2)',
        'purple-glow-hover': '0 8px 25px rgba(139, 92, 246, 0.6), 0 0 30px rgba(139, 92, 246, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;

