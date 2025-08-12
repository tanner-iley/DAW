/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'daw-dark': '#1a1a1a',
        'daw-darker': '#0f0f0f',
        'daw-gray': '#2a2a2a',
        'daw-light-gray': '#3a3a3a',
        'daw-accent': '#6366f1',
        'daw-accent-hover': '#4f46e5',
        'daw-red': '#ef4444',
        'daw-green': '#22c55e',
        'daw-yellow': '#eab308',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
