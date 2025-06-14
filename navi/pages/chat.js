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
  const messagesEndRef = useRef(null);

  // On mount: load saved state, then send first greeting
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('navi_chat_logs') || '[]');
    const savedTone = localStorage.getItem('navi_tone') || 'calm';
    const savedIntent = localStorage.getItem('navi_intent') || '';
    const savedName = localStorage.getItem('navi_user_name') || '';

    setTone(savedTone);
    setIntent(savedIntent);
    setUserName(savedName);

    const isReturning = savedLogs.length > 0;
    let greeting = '';

    if (isReturning) {
      greeting = savedName
        ? `Welcome back, ${savedName}! Would you like to continue where we left off or start a new chat?`
        : `Welcome back! Continue where we left off or type "new chat" to start fresh.`;
    } else {
      greeting = savedName
        ? `Hi ${savedName}! I’m Navi. Let’s talk about "${savedIntent}" in a ${savedTone} tone. How can I help you today?`
        : `Hi there! I’m Navi, here to support you with "${savedIntent}" in a ${savedTone} tone. What should I call you?`;
    }

    setMessages([ { role: 'assistant', content: greeting }, ...savedLogs ]);
  }, []);

  // Persist chat logs & scroll when messages change
  useEffect(() => {
    localStorage.setItem('navi_chat_logs', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a new chat (clears history)
  const handleNewChat = () => {
    localStorage.removeItem('navi_chat_logs');
    setMessages([]);
  };

  // Send user message and fetch AI response
  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    // "new chat" command
    if (text.toLowerCase().includes('new chat')) {
      handleNewChat();
      return;
    }

    // If asking for name
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

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg], tone })
      });
      const { result } = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: result.content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Send on Enter key
  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(to bottom right, #f9f9f6, #e6f0ea)',
      position: 'relative',
      fontFamily: 'sans-serif'
    }}>
      <header
        onClick={() => router.push('/')}
        className="bubble"
        style={{
          backgroundColor: '#6BA292',
          color: '#fff',
          textAlign: 'center',
          padding: '1rem',
          fontWeight: 'bold',
          fontSize: '1.5rem',
          position: 'sticky',
          top: 0,
          cursor: 'pointer'
        }}
      >
        Navi
      </header>

      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <button onClick={handleNewChat} className="bubble" style={{ backgroundColor: '#E3EAE7' }}>
          🔄 New Chat
        </button>
      </div>

      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '10px' }}>
        <button onClick={() => router.push('/journal')} className="bubble" style={{ backgroundColor: '#E3EAE7' }}>
          📝 Journal
        </button>
        <button onClick={() => router.push('/affirmations')} className="bubble" style={{ backgroundColor: '#FFF4D8' }}>
          💛 Affirmations
        </button>
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              maxWidth: '70%',
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              borderRadius: '1rem',
              backgroundColor: msg.role === 'user' ? '#D0EAE1' : '#ffffff',
              alignSelf: msg.role === 'user' ? 'flex-start' : 'flex-end',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              color: '#333'
            }}
          >
            {msg.content}
          </div>
        ))}
        {isTyping && (
          <div style={{ fontStyle: 'italic', color: '#6BA292' }}>Navi is typing...</div>
        )}
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
            width: '100%',
            borderRadius: 8,
            padding: 10,
            border: '1px solid #ccc',
            resize: 'none',
            fontSize: '1rem'
          }}
        />
        <button
          onClick={sendMessage}
          className="bubble"
          style={{
            marginTop: 8,
            backgroundColor: '#6BA292',
            color: '#fff',
            padding: '0.6rem 1.2rem',
            border: 'none',
            borderRadius: 6,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

