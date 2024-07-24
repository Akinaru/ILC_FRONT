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
        '125': '38rem',
        '130': '40rem',
        '135': '42rem',
        '140': '44rem',
        '145': '46rem',
        '150': '50rem',
      },
      scale: {
        '70': '0.7',
        '115': '1.15',
        '120': '1.2',
      },
      maxHeight: {
        '100': '26rem',
        '105': '28rem',
        '110': '32rem',
        '115': '34rem',
        '120': '36rem',
        '125': '38rem',
        '130': '40rem',
      },
      fontSize: {
        '10xl': '10rem',
        '11xl': '11rem',
        '12xl': '12rem',
        '13xl': '13rem',
        '14xl': '14rem',
        '15xl': '15rem',
        '16xl': '16rem',
        '17xl': '17rem',
        '18xl': '18rem',
        '19xl': '19rem',
        '20xl': '20rem',
        '21xl': '21rem',
        '22xl': '22rem',
        '23xl': '23rem',
        '24xl': '24rem',
        '25xl': '25rem',
        'xxs': '0.625rem', 
        'xxxs': '0.5rem', 
        'xxxxs': '0.375rem',
      },
      margin: {
        '37': '9.25rem',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ['light', 'dark'],
  },
}
