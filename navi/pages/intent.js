// File: /pages/intent.js

import { useRouter } from 'next/router';

export default function IntentPage() {
  const router = useRouter();
  const options = [
    'Stress Relief',
    'Finding Clarity',
    'Gratitude',
    'Emotional Support',
    'Positive Focus'
  ];

  const handleSelect = (intent) => {
    localStorage.setItem('navi_intent', intent);
    router.push('/tone');
  };

  const handleCustom = () => {
    const custom = prompt('Please enter your own support request:');
    if (custom?.trim()) handleSelect(custom);
  };

  return (
    <div style={{
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
        What would you like support with today?
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        maxWidth: '600px',
        margin: '0 auto'
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
              textAlign: 'center'
            }}
          >
            {opt}
          </div>
        ))}

        <div
          className="bubble"
          onClick={handleCustom}
          style={{
            backgroundColor: '#E3EAE7',
            color: '#333',
            padding: '1rem',
            textAlign: 'center'
          }}
        >
          Something else?
        </div>
      </div>
    </div>
  );
}
