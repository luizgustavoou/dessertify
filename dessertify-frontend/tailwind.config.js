/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "red-50": "hsl(14, 86%, 98%)",
        "red-100": "hsl(14, 86%, 96%)",
        "red-200": "hsl(14, 86%, 91%)",
        "red-300": "hsl(14, 86%, 84%)",
        "red-400": "hsl(14, 86%, 65%)",
        "red-500": "hsl(14, 86%, 47%)",
        "red-600": "hsl(14, 86%, 35%)",
        "red-700": "hsl(14, 86%, 27%)",
        "red-800": "hsl(14, 86%, 17%)",
        "red-800": "hsl(14, 86%, 11%)",
        "red-900": "hsl(14, 86%, 5%)",
        "rose-50": "hsl(20, 50%, 98%)",
        "rose-100": "hsl(13, 31%, 94%)",
        "rose-300": "hsl(14, 25%, 72%)",
        "rose-400": "hsl(7, 20%, 60%)",
        "rose-500": "hsl(12, 20%, 44%)",
        "rose-900": "hsl(14, 65%, 9%)",
      },
    },
  },
  plugins: [],
};
