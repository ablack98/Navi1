// File: /pages/intent.js

import { useRouter } from 'next/router';

export default function IntentPage() {
  const router = useRouter();
  const options = [
    'Stress Relief',
    'Finding Clarity',
    'Gratitude',
    'Emotional Support',
    'Positive Focus',
    'Goal Setting',
  ];

  const handleSelect = (intent) => {
    localStorage.setItem('navi_intent', intent);
    router.push('/tone');
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#F9F9F6',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>
        What would you like support with today?
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        justifyItems: 'center',
      }}>
        {options.map((opt) => (
          <div
            key={opt}
            className="bubble"
            onClick={() => handleSelect(opt)}
            style={{
              backgroundColor: '#6BA292',
              color: '#fff',
              padding: '1rem',
              borderRadius: '999px',
              cursor: 'pointer',
              textAlign: 'center',
              width: '100%',
              maxWidth: '200px',
            }}
          >
            {opt}
          </div>
        ))}
      </div>

      <textarea
        placeholder="Or something else?"
        onBlur={(e) => e.target.value.trim() && handleSelect(e.target.value)}
        style={{
          marginTop: '2rem',
          width: '100%',
          padding: '1rem',
          borderRadius: '12px',
          border: '1px solid #ccc',
          fontSize: '1rem',
          resize: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      />
    </div>
  );
}
