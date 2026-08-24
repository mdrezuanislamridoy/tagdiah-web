export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FAF8F4',
        surface: '#FFFFFF',
        cream: '#FAF6F0',
        warmwhite: '#FEFCF9',
        linen: '#F3EDE4',
        sand: '#E8DCCB',
        dune: '#D8C7B0',
        beige: '#EBE2D5',
        line: '#E5DCCF',
        bark: '#8B6F52',
        clay: '#B15C3C',
        ink: {
          DEFAULT: '#2B2724',
          70: '#5B534B',
          50: '#8A8178',
          30: '#B9B1A7',
        },
        smoke: '#6B625A',
        brown: {
          DEFAULT: '#8C6A4E',
          soft: '#A98A6D',
          tint: '#F0E7DC',
        },
        gold: {
          DEFAULT: '#B08A3E',
          tint: '#F6EEDA',
        },
        terracotta: {
          DEFAULT: '#BB6440',
          tint: '#F8E9E1',
        },
        sage: {
          DEFAULT: '#5C7A5E',
          tint: '#E9F0E8',
        },
        danger: {
          DEFAULT: '#B0453A',
          tint: '#F9E7E4',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['Jost', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.18em',
      },
      maxWidth: {
        shell: '1360px',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      boxShadow: {
        lift: '0 18px 40px -24px rgba(43, 39, 36, 0.35)',
        card: '0 1px 2px rgba(46,42,38,0.05)',
        pop: '0 10px 30px -10px rgba(46,42,38,0.22)',
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

