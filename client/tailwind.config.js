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
          string: "#a21caf",
          ai: "#8b5cf6",
          benchmark: "#22d3ee",
          playground: "#ec4899"
        },
        glass: "rgba(24, 28, 40, 0.65)",
        glassLight: "rgba(255,255,255,0.08)",
        neon: "#00ffe7"
      },
      boxShadow: {
        glow: "0 0 30px 0 rgba(36, 209, 139, 0.25)",
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        neon: "0 0 16px 2px #00ffe7, 0 0 2px 0 #fff",
        "glow-violet": "0 0 24px 0 rgba(139, 92, 246, 0.2)",
        "glow-cyan": "0 0 24px 0 rgba(34, 211, 238, 0.2)",
        "glow-pink": "0 0 24px 0 rgba(236, 72, 153, 0.2)"
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
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 1.5s linear infinite',
        pulseGlow: 'pulseGlow 2s infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'gradient-x': 'gradient-x 4s ease infinite',
      }
    }
  },
  plugins: []
};
