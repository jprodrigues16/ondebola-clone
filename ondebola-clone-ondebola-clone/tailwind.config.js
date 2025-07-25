/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify the paths to all of the template files in your project so that
  // Tailwind can tree-shake unused styles in production builds. Note that
  // these globs cover both pages and components.
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};