/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-black/20',
    'bg-white/10',
    'backdrop-blur-lg',
    'from-purple-900',
    'via-indigo-800',
    'to-blue-900',
    'from-pink-500',
    'via-purple-500',
    'to-indigo-500',
    'from-purple-600',
    'to-indigo-600',
    'from-purple-700',
    'to-indigo-700',
  ]
}
