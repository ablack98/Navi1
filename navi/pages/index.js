// File: /pages/chat.js

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

export default function Chat() {
  // ... existing hook and helper definitions ...
  const startNewChat = () => {
    localStorage.removeItem('navi_chat_logs');
    setMessages([]);
  };

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'linear-gradient(to bottom right, #f9f9f6, #e6f0ea)', position: 'relative', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <header
        onClick={() => router.push('/')}
        style={{ backgroundColor: '#6BA292', padding: '1rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', color: '#fff', position: 'sticky', top: 0, cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
      >
        Navi
      </header>

      {/* Top-left: Start New Chat */}
      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <button onClick={startNewChat} className="bubble" style={{ backgroundColor: '#E3EAE7', color: '#333' }}>
          🔄 New Chat
        </button>
      </div>

      {/* Top-right: Journal & Affirmations */}
      <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: '10px' }}>
        <button onClick={() => router.push('/journal')} className="bubble" style={{ backgroundColor: '#E3EAE7', color: '#333' }}>
          📝 Journal
        </button>
        <button onClick={() => router.push('/affirmations')} className="bubble" style={{ backgroundColor: '#FFF4D8', color: '#333' }}>
          💛 Affirmations
        </button>
      </div>

      {/* Affirmation Banner */}
      <div style={{ margin: '1rem auto 0', padding: '0.75rem 1.25rem', backgroundColor: '#fff8eb', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'center', maxWidth: '80%', fontStyle: 'italic', color: '#444' }}>
        {affirmation}
      </div>

      {/* Messages */}
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
        {isTyping && <div style={{ fontStyle: 'italic', color: '#6BA292' }}>Navi is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '1rem', borderTop: '1px solid #ddd', backgroundColor: '#fff' }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={2}
          placeholder="Type your thoughts..."
          style={{ width: '100%', borderRadius: 8, padding: 10, border: '1px solid #ccc', resize: 'none', fontSize: '1rem' }}
        />
        <button
          onClick={sendMessage}
          style={{ marginTop: 8, backgroundColor: '#6BA292', color: '#fff', padding: '0.6rem 1.2rem', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
