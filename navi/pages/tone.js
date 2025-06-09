// File: /pages/tone.js

import { useRouter } from 'next/router';

export default function TonePage() {
  const router = useRouter();
  const tones = [
    'Gentle & Encouraging',
    'Supportive & Calm',
    'Warm & Friendly',
    'Positive & Playful',
    'Direct & Insightful',
    'Life Coach Mode'
  ];

  const handleSelect = (tone) => {
    localStorage.setItem('navi_tone', tone.toLowerCase());
    router.push('/chat');
  };

  return (
    <div
    className="tone-container"
      style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#F9F9F6',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#333'
      }}>
        How would you like Navi to speak with you?
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {tones.map((t) => (
          <div
            key={t}
            className="bubble"
            onClick={() => handleSelect(t)}
            style={{
              backgroundColor: '#E3EAE7',
              color: '#333',
              padding: '1rem',
              textAlign: 'center'
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
