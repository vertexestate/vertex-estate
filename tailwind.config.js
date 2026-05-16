
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Forest / teal neutrals (reference: deep green UI) */
        navy: {
          50: '#E8F4F2',
          100: '#C8E4DF',
          200: '#9EC9C1',
          300: '#6BA8A1',
          400: '#3D827C',
          500: '#1E5F5A',
          600: '#143D3D',
          700: '#0F3333',
          800: '#0A2A2A',
          900: '#021616',
        },
        /* Lime accent (reference: #d4ff3f) */
        gold: {
          50: '#F9FFEB',
          100: '#F2FFD6',
          200: '#E6FFAD',
          300: '#DEFF85',
          400: '#E3FF6A',
          500: '#D4FF3F',
          600: '#B8E628',
          700: '#9BC420',
          800: '#6F8A18',
          900: '#3D4D0F',
        },
        cream: '#EFF5F3',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 24px rgba(212, 255, 63, 0.35)',
        'gold-glow-lg': '0 0 48px rgba(212, 255, 63, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 48s linear infinite',
        'gradient-x': 'gradient-x 10s ease infinite',
        shimmer: 'shimmer 3.5s ease-in-out infinite',
        'ambient-breathe': 'ambientBreathe 14s ease-in-out infinite',
        'ambient-breathe-alt': 'ambientBreatheAlt 18s ease-in-out infinite',
        starfield: 'starfieldDrift 32s linear infinite',
        'hero-burns': 'heroKenBurns 28s ease-in-out infinite alternate',
        'tagline-marquee': 'taglineMarquee 32s linear infinite',
        'promo-marquee': 'promoMarquee 28s linear infinite',
      },
      keyframes: {
        ambientBreathe: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.35' },
          '50%': { transform: 'translate(3%, -2%) scale(1.08)', opacity: '0.55' },
        },
        ambientBreatheAlt: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.28' },
          '50%': { transform: 'translate(-4%, 3%) scale(1.1)', opacity: '0.48' },
        },
        starfieldDrift: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '100% 100%' },
        },
        heroKenBurns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.09) translate(-1.2%, -0.8%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%) skewX(-12deg)', opacity: '0' },
          '15%': { opacity: '0.35' },
          '55%': { opacity: '0.35' },
          '100%': { transform: 'translateX(220%) skewX(-12deg)', opacity: '0' },
        },
        taglineMarquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        promoMarquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
