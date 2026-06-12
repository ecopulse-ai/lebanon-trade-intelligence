/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Editorial dark palette — warm charcoal in place of cream.
        // Token names are kept (bone = page surface, ink = primary text)
        // so component classes need no changes; only the values invert.
        bone:    '#16130d',
        bone2:   '#211d15',
        ink:     '#f3eee2',
        ink2:    '#e2dccb',
        graphite:'#c9c2b0',
        slate1:  '#a59e8c',
        slate2:  '#7c7563',
        rule:    '#39342a',

        // Cedar green — Lebanon's national tree, brightened for dark ground
        cedar:   '#8bab86',
        cedar2:  '#6f8f6c',
        cedar3:  '#a9c4a4',

        // Burgundy — secondary accent for deficits/imports
        burgundy:'#cf7d7d',
        burgundy2:'#e09a9a',

        // Gold — Lebanon's gold trade is so dominant it earns its own accent
        gold:    '#d8b057',
        gold2:   '#ecc878',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', '"Helvetica Neue"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"SF Mono"', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      boxShadow: {
        editorial: '0 1px 0 #d4cdb8',
      },
    },
  },
  plugins: [],
}
