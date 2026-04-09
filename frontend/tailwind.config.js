/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Sora"', 'sans-serif'],
      },
      colors: {
        brand: {
          night: '#0F172A',
          slate: '#1E293B',
          sand: '#FFF4E8',
          ember: '#FF6B3D',
          aqua: '#1ECBE1',
          mint: '#A7F3D0',
        },
      },
      boxShadow: {
        glow: '0 16px 50px rgba(255, 107, 61, 0.26)',
        neon: '0 10px 35px rgba(30, 203, 225, 0.28)',
        panel: '0 18px 40px rgba(15, 23, 42, 0.12)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px) scale(1)' },
          '50%': { transform: 'translateX(14px) scale(1.04)' },
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        pulseRing: {
          '0%': { boxShadow: '0 0 0 0 rgba(30, 203, 225, 0.35)' },
          '100%': { boxShadow: '0 0 0 14px rgba(30, 203, 225, 0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        drift: 'drift 8s ease-in-out infinite',
        revealUp: 'revealUp 0.7s ease-out both',
        pulseRing: 'pulseRing 1.2s ease-out',
      },
    },
  },
  plugins: [],
}
