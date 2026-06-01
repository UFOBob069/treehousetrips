/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        forest: {
          50: '#f4f7f4',
          100: '#e4ebe3',
          200: '#c8d5c6',
          300: '#9fb39c',
          400: '#6d8a68',
          500: '#4a6b45',
          600: '#3a5636',
          700: '#2f462c',
          800: '#243824',
          900: '#1a2b1a',
          950: '#0f1a10',
        },
        cream: {
          DEFAULT: '#faf8f5',
          dark: '#f5f2ec',
        },
        moss: {
          DEFAULT: '#5a6f54',
          light: '#7a8f74',
        },
        fog: '#e8e4dd',
        amber: {
          muted: '#c4a574',
          warm: '#d4b896',
        },
        wood: '#6b5344',
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(to bottom, rgba(15,26,16,0.12) 0%, rgba(15,26,16,0.26) 45%, rgba(15,26,16,0.52) 100%)',
        'hero-gradient-mobile':
          'linear-gradient(to bottom, rgba(15,26,16,0.05) 0%, rgba(15,26,16,0.18) 55%, rgba(15,26,16,0.42) 100%)',
      },
      animation: {
        'ken-burns': 'kenBurns 24s ease-in-out infinite alternate',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1.2s ease-out forwards',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
