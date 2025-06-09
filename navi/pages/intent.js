import { useRouter } from 'next/router';

export default function Intent() {
  const router = useRouter();

  const handleSelect = (intent) => {
    localStorage.setItem('navi_intent', intent);
    router.push('/tone');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#F9F9F6', minHeight: '100vh', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>What would you like support with today?</h1>
      {['Stress relief', 'Finding clarity', 'Gratitude', 'Emotional support', 'Positive focus'].map((option, idx) => (
        <div
          key={idx}
          onClick={() => handleSelect(option)}
          style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '999px', marginBottom: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', cursor: 'pointer', textAlign: 'center' }}
        >
          {option}
        </div>
      ))}
      <textarea
        placeholder="Or something else?"
        onBlur={(e) => e.target.value && handleSelect(e.target.value)}
        style={{ width: '100%', borderRadius: '12px', padding: '1rem', border: '1px solid #ccc', fontSize: '1rem', resize: 'none', marginTop: '1rem' }}
      />
    </div>
  );
}
