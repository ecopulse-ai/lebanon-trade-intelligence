/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Editorial cream-and-ink palette
        bone:    '#f5f1e8',
        bone2:   '#ebe6d8',
        ink:     '#0d1117',
        ink2:    '#1c2128',
        graphite:'#3d3d3d',
        slate1:  '#5a5a5a',
        slate2:  '#8a8a8a',
        rule:    '#d4cdb8',

        // Cedar green — Lebanon's national tree, taken as the dominant accent
        cedar:   '#3d5a40',
        cedar2:  '#2a3f2c',
        cedar3:  '#7a9b78',

        // Burgundy — secondary accent for deficits/imports
        burgundy:'#7a2e2e',
        burgundy2:'#a04545',

        // Gold — Lebanon's gold trade is so dominant it earns its own accent
        gold:    '#a87c2a',
        gold2:   '#d4a548',
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
