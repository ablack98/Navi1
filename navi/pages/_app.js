// File: /pages/_app.js
import '../styles/globals.css';  // your existing globals

export default function App({ Component, pageProps }) {
  return (
    // Background wrapper
    <div
      style={{
        backgroundImage: 'url("/background-pattern.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      {/* Translucent overlay for readability */}
      <div
        style={{
          backgroundColor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(4px)',
          minHeight: '100vh'
        }}
      >
        <Component {...pageProps} />
      </div>
    </div>
  );
}
