/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#101A31',
          800: '#1A294A',
          900: '#101A31',
          950: '#0A1122',
        },
        cobalt: {
          DEFAULT: '#4664F5',
          50: '#EEF2FF',
          100: '#E0E7FE',
          200: '#C7D4FE',
          500: '#5A75F8',
          600: '#4664F5',
          700: '#3550D6',
          800: '#263BA6',
        },
        mint: {
          DEFAULT: '#6EE7D2',
          50: '#F0FDFB',
          100: '#CCFBF4',
          200: '#99F6E8',
          400: '#6EE7D2',
          500: '#2DD4BF',
          600: '#0F766E',
          700: '#115E59',
        },
        cloud: '#F7F9FC',
        surface: '#FFFFFF',
        ink: {
          DEFAULT: '#121D33',
          light: '#334155',
          muted: '#64748B',
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(16, 26, 49, 0.04), 0 1px 2px 0 rgba(16, 26, 49, 0.02)',
        card: '0 4px 12px -2px rgba(16, 26, 49, 0.06), 0 2px 6px -1px rgba(16, 26, 49, 0.03)',
        floating: '0 12px 28px -4px rgba(16, 26, 49, 0.12), 0 4px 10px -2px rgba(16, 26, 49, 0.05)',
        glow: '0 0 24px -4px rgba(110, 231, 210, 0.35)',
      },
      animation: {
        'ambient-glow': 'ambientGlow 12s ease-in-out infinite alternate',
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        ambientGlow: {
          '0%': { transform: 'translate(0px, 0px) scale(1)', opacity: '0.35' },
          '100%': { transform: 'translate(25px, -20px) scale(1.15)', opacity: '0.6' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        }
      }
    },
  },
  plugins: [],
}
