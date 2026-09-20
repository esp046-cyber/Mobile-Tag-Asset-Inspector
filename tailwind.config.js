/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Industrial HMI-inspired palette — graphite base, instrument accents.
        graphite: {
          950: '#0F1215',
          900: '#14181C',
          800: '#1C2227',
          700: '#252C33',
          600: '#2A3138',
          500: '#3A434C'
        },
        ink: {
          100: '#E8ECEF',
          300: '#B7C0C8',
          500: '#8B96A0',
          700: '#5B6670'
        },
        signal: {
          good: '#3DDC97',
          warn: '#F2B705',
          bad: '#E5484D',
          info: '#4FA8E0'
        }
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)'
      },
      animation: {
        'pulse-slow': 'pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    }
  },
  plugins: []
}
