import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neutral-light': '#f8f9fa',
        'neutral-dark': '#212529',
        'primary-blue': '#0077b6',
        'primary-cyan': '#00b4d8',
        'primary-teal': '#48cae4',
        'accent-yellow': '#ffb703',
        'accent-orange': '#fb8500',
      },
    },
  },
  plugins: [],
}

export default config
