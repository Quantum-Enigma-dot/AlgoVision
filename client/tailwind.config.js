/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"]
      },
      colors: {
        ink: "#0d1117",
        sky: "#e6f1ff",
        ember: "#ff6a3d",
        jade: "#24d18b",
        ocean: "#0b4f6c",
        dusk: "#1b2230",
        fog: "#c9d2e0",
        accent: {
          sorting: "#10b981",
          graph: "#f59e0b",
          dp: "#2563eb",
          string: "#a21caf"
        },
        glass: "rgba(24, 28, 40, 0.65)",
        glassLight: "rgba(255,255,255,0.08)",
        neon: "#00ffe7"
      },
      boxShadow: {
        glow: "0 0 30px 0 rgba(36, 209, 139, 0.25)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        neon: "0 0 16px 2px #00ffe7, 0 0 2px 0 #fff"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      blur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
      },
      transitionProperty: {
        'spacing': 'margin, padding',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 #00ffe7' },
          '50%': { boxShadow: '0 0 16px 4px #00ffe7' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s linear infinite',
        pulseGlow: 'pulseGlow 2s infinite',
      }
    }
  },
  plugins: []
};
