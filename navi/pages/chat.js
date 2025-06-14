// File: pages/chat.js

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

export default function Chat() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [tone, setTone] = useState('calm');
  const [intent, setIntent] = useState('');
  const [userName, setUserName] = useState('');
  const [greeted, setGreeted] = useState(false);
  const messagesEndRef = useRef(null);

  // Load saved state on mount
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('navi_chat_logs') || '[]');
    const savedTone = localStorage.getItem('navi_tone') || 'calm';
    const savedIntent = localStorage.getItem('navi_intent') || '';
    const savedName = localStorage.getItem('navi_user_name') || '';
    setMessages(savedLogs);
    setTone(savedTone);
    setIntent(savedIntent);
    setUserName(savedName);
  }, []);

  // Inject initial greeting once
  useEffect(() => {
    if (!greeted) {
      if (messages.length > 0) {
        // Returning user
        const greeting = userName
          ? `Welcome back, ${userName}! Would you like to continue where you left off or start a new chat?`
          : `Welcome back! Would you like to continue where you left off or start a new chat?`;
        setMessages(msgs => [...msgs, { role: 'assistant', content: greeting }]);
      } else {
        // New user
        const greeting = userName
          ? `Hi ${userName}! I’m Navi, here to support you with "${intent}" in a ${tone} tone. How can I assist today?`
          : `Hi! I’m Navi, here to support you with "${intent}" in a ${tone} tone. What should I call you?`;
        setMessages([{ role: 'assistant', content: greeting }]);
      }
      setGreeted(true);
    }
  }, [greeted, messages.length, userName, tone, intent]);

  // Persist logs & scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    localStorage.setItem('navi_chat_logs', JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    // Returning user “new chat” interceptor
    if (messages.length > 1 && text.toLowerCase().includes('new chat')) {
      localStorage.removeItem('navi_chat_logs');
      setMessages([]);
      setGreeted(false);
      return;
    }

    // New user name interceptor
    if (!userName) {
      localStorage.setItem('navi_user_name', text);
      setUserName(text);
      setMessages(prev => [
        ...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: `Nice to meet you, ${text}! How can I assist you today?` }
      ]);
      return;
    }

    // Standard chat flow
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], tone })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.result.content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: 'linear-gradient(to bottom right, #f9f9f6, #e6f0ea)',
      position: 'relative', fontFamily: 'sans-serif'
    }}>
      <header
        onClick={() => router.push('/')}
        className="bubble"
        style={{
          backgroundColor: '#6BA292', color: '#fff', textAlign: 'center',
          padding: '1rem', fontWeight: 'bold', fontSize: '1.5rem',
          position: 'sticky', top: 0, cursor: 'pointer'
        }}
      >Navi</header>

      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <button className="bubble" onClick={sendMessage} style={{ background: '#E3EAE7' }}>
          🔄 New Chat
        </button>
      </div>

      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '10px' }}>
        <button onClick={() => router.push('/journal')} className="bubble" style={{ background: '#E3EAE7' }}>📝 Journal</button>
        <button onClick={() => router.push('/affirmations')} className="bubble" style={{ background: '#FFF4D8' }}>💛 Affirmations</button>
      </div>

      <div style={{
        margin: '1rem auto', padding: '0.75rem 1.25rem', backgroundColor: '#fff8eb',
        borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'center',
        maxWidth: '80%', fontStyle: 'italic', color: '#444'
      }}>
        {/* You can optionally fetch a GPT-generated affirmation here */}
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            maxWidth: '70%', marginBottom: '1rem', padding: '0.75rem 1rem',
            borderRadius: '1rem', backgroundColor: msg.role === 'user' ? '#D0EAE1' : '#ffffff',
            alignSelf: msg.role === 'user' ? 'flex-start' : 'flex-end',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)', color: '#333'
          }}>
            {msg.content}
          </div>
        ))}
        {isTyping && <div style={{ fontStyle: 'italic', color: '#6BA292' }}>Navi is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '1rem', borderTop: '1px solid #ddd', backgroundColor: '#fff' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={2}
          placeholder="Type your thoughts..."
          style={{
            width: '100%', borderRadius: 8, padding: 10,
            border: '1px solid #ccc', resize: 'none', fontSize: '1rem'
          }}
        />
        <button
          onClick={sendMessage}
          className="bubble"
          style={{ marginTop: 8, backgroundColor: '#6BA292', color: '#fff', padding: '0.6rem 1.2rem', border: 'none', borderRadius: 6, fontWeight: 'bold' }}
        >Send</button>
      </div>
    </div>
  );
}
