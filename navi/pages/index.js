import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ backgroundColor: '#F9F9F6', minHeight: '100vh', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>Welcome to Navi</h1>
      <p style={{ fontSize: '1rem', marginBottom: '2rem', color: '#666', textAlign: 'center', maxWidth: '600px' }}>
        Your personal space for calm, clarity, and daily support.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => router.push('/intent')}
          style={{ backgroundColor: '#6BA292', color: '#fff', padding: '1rem 2rem', fontSize: '1rem', border: 'none', borderRadius: '999px', cursor: 'pointer' }}
        >
          Try Navi for Free
        </button>
        <button
          onClick={() => router.push('/chat')}
          style={{ backgroundColor: '#D8EAE3', color: '#333', padding: '1rem 2rem', fontSize: '1rem', border: 'none', borderRadius: '999px', cursor: 'pointer' }}
        >
          Continue My Journey
        </button>
      </div>
    </div>
  );
}
