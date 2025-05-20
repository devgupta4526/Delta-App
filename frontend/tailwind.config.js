/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5C67F2',
        accent: '#FF7D66',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        textPrimary: '#1B1F3B',
        textSecondary: '#6B7280',
        border: '#E5E7EB',
      },
    },
  },
  plugins: [],
};
