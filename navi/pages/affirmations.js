import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const affirmationList = [
  "I am grounded, calm, and in control.",
  "I deserve peace and positivity.",
  "Gratitude fills my heart and mind.",
  "My journey is unfolding perfectly.",
  "I radiate joy and compassion."
];

export default function Affirmations() {
  const [favorites, setFavorites] = useState([]);
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('navi_fav_affirmations');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % affirmationList.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = () => {
    const aff = affirmationList[current];
    const updated = favorites.includes(aff)
      ? favorites.filter(f => f !== aff)
      : [...favorites, aff];
    setFavorites(updated);
    localStorage.setItem('navi_fav_affirmations', JSON.stringify(updated));
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', backgroundColor: '#F9F9F6', height: '100vh' }}>
      <h2 onClick={() => router.push('/')} style={{ cursor: 'pointer', color: '#6BA292' }}>← Back to Navi</h2>
      <h1 style={{ marginBottom: '1rem' }}>Daily Affirmation</h1>

      <div style={{ backgroundColor: '#FFF4D8', padding: '2rem', borderRadius: '12px', fontSize: '1.2rem', boxShadow: '0 1px 5px rgba(0,0,0,0.1)', textAlign: 'center' }}>
        {affirmationList[current]}
      </div>

      <button onClick={toggleFavorite} style={{ marginTop: '1.5rem', padding: '0.5rem 1rem', borderRadius: 6, backgroundColor: '#FFD700', color: '#333', border: 'none', cursor: 'pointer' }}>
        {favorites.includes(affirmationList[current]) ? '★ Remove from Favorites' : '☆ Save to Favorites'}
      </button>
    </div>
  );
}
