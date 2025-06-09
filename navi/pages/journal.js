import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('navi_journal');
    if (stored) setEntries(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem('navi_journal', JSON.stringify(entries));
  }, [entries]);

  const saveEntry = () => {
    if (!newEntry.trim()) return;
    const entry = { content: newEntry, timestamp: new Date().toISOString() };
    setEntries((prev) => [...prev, entry].slice(-7));
    setNewEntry('');
  };

  const deleteEntry = (index) => {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  };

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', backgroundColor: '#F9F9F6', height: '100vh' }}>
      <h2 onClick={() => router.push('/')} style={{ cursor: 'pointer', color: '#6BA292' }}>← Back to Navi</h2>
      <h1 style={{ marginBottom: '1rem' }}>Your Journal</h1>

      <textarea
        value={newEntry}
        onChange={(e) => setNewEntry(e.target.value)}
        placeholder="Reflect here..."
        rows={4}
        style={{ width: '100%', padding: '1rem', borderRadius: 8, border: '1px solid #ccc', marginBottom: '1rem' }}
      />
      <button onClick={saveEntry} style={{ backgroundColor: '#6BA292', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 6, cursor: 'pointer' }}>
        Save Entry
      </button>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '2rem' }}>
        {entries.map((entry, idx) => (
          <li key={idx} style={{ backgroundColor: '#fff', padding: '1rem', marginBottom: '1rem', borderRadius: 8, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
            <div style={{ marginBottom: '0.5rem', color: '#777' }}>{new Date(entry.timestamp).toLocaleString()}</div>
            <div style={{ marginBottom: '0.75rem' }}>{entry.content}</div>
            <button onClick={() => deleteEntry(idx)} style={{ backgroundColor: '#f76c6c', color: '#fff', border: 'none', borderRadius: 4, padding: '0.25rem 0.75rem', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
