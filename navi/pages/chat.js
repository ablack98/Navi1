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
  const [askedName, setAskedName] = useState(false);
  const messagesEndRef = useRef(null);

  // On mount: load saved data & send initial greeting
  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem('navi_chat_logs') || '[]');
    const savedTone = localStorage.getItem('navi_tone') || 'calm';
    const savedIntent = localStorage.getItem('navi_intent') || '';
    const savedName = localStorage.getItem('navi_user_name') || '';

    setTone(savedTone);
    setIntent(savedIntent);
    setUserName(savedName);

    // If returning and have logs, let existing flow handle it
    if (savedLogs.length > 0) {
      setMessages(savedLogs);
      return;
    }

    // New user: ask for their name
    setMessages([
      {
        role: 'assistant',
        content: `Hi, I’m Navi and I’m here to help you with whatever you need. What can I call you?`
      }
    ]);
    setAskedName(true);
  }, []);

  // Persist & scroll
  useEffect(() => {
    localStorage.setItem('navi_chat_logs', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    setInput('');

    // If just asked for name
    if (askedName && !userName) {
      localStorage.setItem('navi_user_name', text);
      setUserName(text);
      setMessages(prev => [
        ...prev,
        { role: 'user', content: text },
        { role: 'assistant', content: `Nice to meet you, ${text}! What can I help you with today?` }
      ]);
      return;
    }

    // Standard chat flow...
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

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', background:'linear-gradient(to bottom right, #f9f9f6, #e6f0ea)', position:'relative', fontFamily:'sans-serif' }}>
      {/* header & navigation omitted for brevity */}
      <div style={{ flexGrow:1, overflowY:'auto', padding:'1rem' }}>
        {messages.map((msg,i)=>(
          <div key={i} style={{
            maxWidth:'70%', marginBottom:'1rem', padding:'0.75rem 1rem',
            borderRadius:'1rem',
            backgroundColor: msg.role==='user'?'#D0EAE1':'#fff',
            alignSelf: msg.role==='user'?'flex-start':'flex-end',
            boxShadow:'0 1px 3px rgba(0,0,0,0.05)'
          }}>
            {msg.content}
          </div>
        ))}
        {isTyping && <div style={{ fontStyle:'italic', color:'#6BA292' }}>Navi is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ padding:'1rem', borderTop:'1px solid #ddd', backgroundColor:'#fff' }}>
        <textarea
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={2}
          placeholder="Type your thoughts..."
          style={{ width:'100%', borderRadius:8, padding:10, border:'1px solid #ccc', resize:'none', fontSize:'1rem' }}
        />
        <button onClick={sendMessage} className="bubble" style={{ marginTop:8, backgroundColor:'#6BA292', color:'#fff', padding:'0.6rem 1.2rem', border:'none', borderRadius:6, fontWeight:'bold', cursor:'pointer' }}>
          Send
        </button>
      </div>
    </div>
  );
}
