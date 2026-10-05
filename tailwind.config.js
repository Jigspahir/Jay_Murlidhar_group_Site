/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        surface: {
          bg: '#FAFAFA',
          card: '#FFFFFF',
          subtle: '#F1F5F9',
        },
        content: {
          primary: '#111827',
          secondary: '#1E293B',
          body: '#64748B',
          muted: '#94A3B8',
          darkHeading: '#F8FAFC',
          darkBody: '#CBD5E1',
        },
        line: {
          border: '#E2E8F0',
          hover: '#CBD5E1',
        },
        brand: {
          blue: '#2563EB',
          purple: '#7C3AED',
          pink: '#EC4899',
          orange: '#F97316',
          green: '#10B981',
          slate: '#0F172A',
        }
      },
      maxWidth: {
        'content': '1240px',
      },
      borderRadius: {
        'card': '16px',
        'container': '20px',
        'btn': '10px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        'elevated': '0 4px 12px 0 rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.03)',
        'modal': '0 20px 25px -5px rgba(11, 18, 32, 0.1), 0 8px 10px -6px rgba(11, 18, 32, 0.05)',
      }
    },
  },
  plugins: [],
}

