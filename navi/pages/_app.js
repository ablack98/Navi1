// pages/_app.js
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <div style={{
      position: 'fixed',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
    }}>
      <div className="page-overlay">
        <Component {...pageProps} />
      </div>
    </div>
  );
}
