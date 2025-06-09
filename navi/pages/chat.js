import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

const affirmationsList = [
  "You are capable of more than you know.",
  "Today, I choose joy.",
  "Your heart knows the way—follow it.",
  "Breathe in calm, breathe out stress.",
  "Gratitude opens the door to abundance."
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tone, setTone] = useState('calm');
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const router = useRouter();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedLogs = localStorage.getItem('navi_chat_logs');
    const savedTone = localStorage.getItem('navi_tone');
    if (savedLogs) setMessages(JSON.parse(savedLogs));
    if (savedTone) setTone(savedTone);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAffirmation((prev) => (prev + 1) % affirmationsList.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('navi_chat_logs', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], tone })
      });
      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.result.content };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#F9F9F6', fontFamily: 'sans-serif', position: 'relative' }}>
      <header style={{ backgroundColor: '#6BA292', padding: '1rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', color: '#fff', position: 'sticky', top: 0, zIndex: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>Navi</header>

      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '10px' }}>
        <button onClick={() => router.push('/journal')} style={{ padding: '0.4rem 0.8rem', borderRadius: '999px', backgroundColor: '#E3EAE7', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>📝 Journal</button>
        <button onClick={() => router.push('/affirmations')} style={{ padding: '0.4rem 0.8rem', borderRadius: '999px', backgroundColor: '#FFF4D8', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>💛 Affirmations</button>
      </div>

      <div style={{ margin: '1rem auto 0', padding: '0.75rem 1.25rem', backgroundColor: '#fff8eb', borderRadius: '12px', color: '#444', fontStyle: 'italic', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '80%' }}>
        {affirmationsList[currentAffirmation]}
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem', paddingTop: '1rem' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              maxWidth: '70%',
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              backgroundColor: msg.role === 'user' ? '#D0EAE1' : '#ffffff',
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              color: '#333'
            }}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{ fontStyle: 'italic', color: '#6BA292', paddingLeft: 6 }}>Navi is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #ddd', backgroundColor: '#fff' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={2}
          placeholder="Type your thoughts..."
          style={{ width: '100%', borderRadius: 8, padding: 10, fontSize: '1rem', border: '1px solid #ccc', resize: 'none' }}
        />
        <button
          onClick={sendMessage}
          style={{ marginTop: 8, backgroundColor: '#6BA292', color: '#fff', padding: '0.6rem 1.2rem', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
