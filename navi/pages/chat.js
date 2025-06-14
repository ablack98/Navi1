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

  // Automatically inject the first greeting if we haven't yet
  useEffect(() => {
    if (!greeted) {
      let greeting;
      if (messages.length === 0) {
        // New chat
        greeting = userName
          ? `Hi ${userName}! I’m Navi. Let’s talk about "${intent}" in a ${tone} tone. How can I help you today?`
          : `Hi there! I’m Navi, your ${tone} support coach for "${intent}". What should I call you?`;
      } else {
        // Returning
        greeting = userName
          ? `Welcome back, ${userName}! Continue where we left off or type “new chat” to start fresh.`
          : `Welcome back! Continue where we left off or type “new chat” to start fresh.`;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: greeting }]);
      setGreeted(true);
    }
  }, [greeted, messages, tone, intent, userName]);

  // Persist logs & scroll
  useEffect(() => {
    localStorage.setItem('navi_chat_logs', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    // Check for “new chat” command
    if (text.toLowerCase().includes('new chat')) {
      localStorage.removeItem('navi_chat_logs');
      setMessages([]);
      setGreeted(false);
      return;
    }

    // If we just asked for the user’s name
    if (!userName) {
      localStorage.setItem('navi_user_name', text);
      setUserName(text);
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: `Nice to meet you, ${text}! How can I assist you today?` }
      ]);
      return;
    }

    // Normal chat flow
    const userMsg = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], tone })
      });
      const { result } = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: result.content }]);
    } catch {
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
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: 'linear-gradient(to bottom right, #f9f9f6, #e6f0ea)',
      position: 'relative', fontFamily: 'sans-serif'
    }}>
      <header onClick={() => router.push('/')} className="bubble" style={{
        backgroundColor: '#6BA292', color: '#fff', textAlign: 'center',
        padding: '1rem', fontWeight: 'bold', fontSize: '1.5rem',
        position: 'sticky', top: 0, cursor: 'pointer'
      }}>Navi</header>

      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <button onClick={sendMessage} className="bubble" style={{ background: '#E3EAE7' }}>🔄 New Chat</button>
      </div>

      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '10px' }}>
        <button onClick={() => router.push('/journal')} className="bubble" style={{ background: '#E3EAE7' }}>📝 Journal</button>
        <button onClick={() => router.push('/affirmations')} className="bubble" style={{ background: '#FFF4D8' }}>💛 Affirmations</button>
      </div>

      <div style={{
        flexGrow: 1, overflowY: 'auto', padding: '1rem'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
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
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={2}
          placeholder="Type your thoughts..."
          style={{ width: '100%', borderRadius: 8, padding: 10, border: '1px solid #ccc', resize: 'none', fontSize: '1rem' }}
        />
        <button onClick={sendMessage} className="bubble" style={{
          marginTop: 8, backgroundColor: '#6BA292', color: '#fff',
          padding: '0.6rem 1.2rem', border: 'none', borderRadius: 6, fontWeight: 'bold'
        }}>Send</button>
      </div>
    </div>
  );
}
