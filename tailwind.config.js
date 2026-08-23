export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6F0',
        warmwhite: '#FEFCF9',
        linen: '#F3EDE4',
        sand: '#E8DCCB',
        dune: '#D8C7B0',
        bark: '#8B6F52',
        clay: '#B15C3C',
        ink: '#2B2724',
        smoke: '#6B625A',
        gold: '#B08A3E',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
      },
    },
  },
  plugins: [],
}
