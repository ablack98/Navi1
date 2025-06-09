// File: /pages/_app.js

import '../styles/globals.css';    // ensure your global styles are loaded

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
