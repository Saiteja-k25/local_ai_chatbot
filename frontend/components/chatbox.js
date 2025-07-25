
// frontend/components/ChatBox.js
import { useState } from 'react';

export default function ChatBox() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);

    const res = await fetch('/api/chat/1/message', {
      method: 'POST',
      body: JSON.stringify({ content: input }),
      headers: { 'Content-Type': 'application/json' }
    });

    const reader = res.body.getReader();
    let botMsg = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, botMsg]);

    const decoder = new TextDecoder();
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last.role === 'assistant') {
          last.content += chunk;
          return [...prev.slice(0, -1), last];
        }
        return prev;
      });
    }

    setInput('');
  };

  return (
    <div className="flex flex-col flex-grow p-4">
      <div className="flex-grow overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={`p-2 my-1 rounded ${msg.role === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'}`}>{msg.content}</div>
        ))}
      </div>
      <div className="flex mt-2">
        <input className="flex-grow p-2 border" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
        <button className="ml-2 p-2 bg-blue-500 text-white" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}