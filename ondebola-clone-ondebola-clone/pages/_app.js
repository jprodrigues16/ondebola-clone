import '../styles/globals.css';

/**
 * Custom App component for Next.js. This file is used to initialize
 * pages. We import the global stylesheet here so that Tailwind CSS
 * classes are available throughout the application. Feel free to add
 * layout providers or other global context wrappers here in the future.
 */
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;