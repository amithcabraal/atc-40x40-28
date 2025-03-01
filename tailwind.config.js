/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'rest-gradient': 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        'exercise-gradient': 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        'rest-gradient-dark': 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        'exercise-gradient-dark': 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
      },
    },
    // Add container query breakpoints
    containers: {
      'sm': '320px',
      'md': '480px',
      'lg': '640px',
      'xl': '800px',
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
};