/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          base:     '#0d0d14',
          card:     '#13131f',
          elevated: '#1a1a2e',
          input:    '#0f0f1a',
          border:   '#1e1e30',
          hover:    '#1e1e2e',
        },
      },
      boxShadow: {
        card:         '0 0 0 1px #1e1e30, 0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 0 0 1px #2a2a42, 0 8px 32px rgba(0,0,0,0.6)',
        modal:        '0 0 0 1px #2a2a42, 0 24px 64px rgba(0,0,0,0.7)',
        'glow-green': '0 0 12px rgba(34,197,94,0.3)',
      },
      backgroundImage: {
        'gradient-auth-bg':    'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(34,197,94,0.07) 0%, transparent 50%)',
        'gradient-card-green': 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, transparent 60%)',
        'gradient-card-amber': 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, transparent 60%)',
        'gradient-card-blue':  'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 60%)',
        'gradient-sidebar':    'linear-gradient(180deg, #0d0d14 0%, #0f0f1c 100%)',
      },
      keyframes: {
        'border-beam': {
          '100%': { 'offset-distance': '100%' },
        },
        'shine': {
          '0%': { '--shine-angle': '-45deg' },
          '100%': { '--shine-angle': '405deg' },
        },
        'gradient': {
          to: { backgroundPosition: '200% center' },
        },
        'meteor-effect': {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: '1' },
          '70%': { opacity: '1' },
          '100%': { transform: 'rotate(215deg) translateX(-500px)', opacity: '0' },
        },
        'shimmer-slide': {
          to: { backgroundPosition: '100% center' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'border-beam':    'border-beam calc(var(--duration)*1s) infinite linear',
        shine:            'shine var(--shine-duration) linear infinite',
        gradient:         'gradient 3s linear infinite',
        'meteor-effect':  'meteor-effect linear infinite',
        'shimmer-slide':  'shimmer-slide var(--speed, 3s) ease-in-out infinite alternate',
      },
    },
  },
  plugins: [],
};
