// frontend/components/ChatSidebar.js
import { useState, useEffect } from 'react';

export default function ChatSidebar() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chats');
        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error('Failed to fetch chats', err);
      }
    };
    fetchChats();
  }, []);

  return (
    <div className="w-64 bg-gray-100 p-4 border-r">
      <button className="w-full p-2 mb-4 bg-green-500 text-white rounded">New Chat</button>
      <div className="space-y-2">
        {chats.map(chat => (
          <div key={chat.id} className="p-2 bg-white rounded shadow">
            {chat.title} <br /> <span className="text-sm text-gray-500">{new Date(chat.created_at).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}