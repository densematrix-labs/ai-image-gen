/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep purple-blue gradient palette
        'deep': {
          900: '#0a0a1a',
          800: '#12122e',
          700: '#1a1a42',
          600: '#252556',
        },
        // Neon accents
        'neon': {
          cyan: '#00ffff',
          pink: '#ff00ff',
          purple: '#9b59ff',
        },
        // Surface colors
        'surface': {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          hover: 'rgba(255, 255, 255, 0.1)',
          active: 'rgba(255, 255, 255, 0.15)',
        }
      },
      fontFamily: {
        'display': ['Sora', 'sans-serif'],
        'body': ['"DM Sans"', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(268, 100%, 50%, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.1) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
