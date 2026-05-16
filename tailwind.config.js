const { colors, spacing, radius, fontFamily, fontSize } = require('./src/theme/tokens');

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      spacing,
      borderRadius: radius,
      fontFamily,
      fontSize,
    },
  },
  plugins: [],
};
