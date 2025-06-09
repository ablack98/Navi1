import { useRouter } from 'next/router';

export default function Tone() {
  const router = useRouter();

  const handleSelect = (tone) => {
    localStorage.setItem('navi_tone', tone);
    router.push('/chat');
  };

  const tones = [
    'Gentle & Encouraging',
    'Supportive & Calm',
    'Warm & Friendly',
    'Positive & Playful',
    'Direct & Insightful',
    'Life Coach Mode'
  ];

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#F9F9F6', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>How would you like Navi to speak with you?</h1>
      {tones.map((tone, idx) => (
        <div
          key={idx}
          onClick={() => handleSelect(tone)}
          style={{ backgroundColor: '#E3EAE7', padding: '1rem', borderRadius: '999px', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', textAlign: 'center' }}
        >
          {tone}
        </div>
      ))}
    </div>
  );
}
