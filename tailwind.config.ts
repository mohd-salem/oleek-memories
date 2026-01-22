import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors from 04-DESIGN-SYSTEM.md
        cream: {
          50: '#FDFCFB',
          100: '#F9F7F4',
          200: '#F3EFE9',
        },
        charcoal: {
          700: '#4A4A4A',
          800: '#2D2D2D',
          900: '#1A1A1A',
        },
        gold: {
          400: '#D4AF37',
          500: '#C19B2E',
          600: '#A68425',
        },
        rose: {
          100: '#FAF0F3',
          300: '#E8BFC9',
          500: '#D4889E',
        },
        slate: {
          400: '#8FA3B0',
          500: '#6B8394',
          600: '#4F6373',
        },
        amazon: {
          DEFAULT: '#FF9900',
          dark: '#E68A00',
        },
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // Type scale (Major Third for desktop)
        'xs': '0.75rem',    // 12px
        'sm': '0.875rem',   // 14px
        'base': '1rem',     // 16px
        'lg': '1.125rem',   // 18px
        'xl': '1.25rem',    // 20px
        '2xl': '1.563rem',  // 25px
        '3xl': '1.953rem',  // 31px
        '4xl': '2.441rem',  // 39px
        '5xl': '3.052rem',  // 49px
        '6xl': '3.815rem',  // 61px
      },
      lineHeight: {
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
      },
      maxWidth: {
        'container': '1280px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
