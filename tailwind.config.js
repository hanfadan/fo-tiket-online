/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#A00E4F",
        secondary: "#444444",
        tertiary: "#161616",
        "blue-primary": "#0266D6",
        disabled: "#94a3b8",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};
