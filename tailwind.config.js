/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '100': '26rem',
        '105': '28rem',
        '110': '32rem',
        '115': '34rem',
        '120': '36rem',
        '150': '50rem',
      },
      scale: {
        '70': '0.7',
        '115': '1.15',
        '120': '1.2',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['light'],
  },
}

