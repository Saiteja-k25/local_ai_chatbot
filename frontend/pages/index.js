import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Send a message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:5000/ollama', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: newMessages,
          model: 'tinyllama'
        })
      });

      // Safe JSON parsing
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error('Invalid JSON from backend:', jsonErr);
        setMessages([
          ...newMessages,
          { role: 'assistant', content: '⚠️ Invalid response from backend.' }
        ]);
        setIsTyping(false);
        return;
      }

      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.response || '⚠️ No response from backend.' }
      ]);
    } catch (err) {
      console.error('Chat API failed:', err);
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '⚠️ Error: Could not fetch response' }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Head>
        <title>Local AI Chatbot</title>
      </Head>

      <div className="max-w-2xl mx-auto flex flex-col h-[90vh]">
        <h1 className="text-3xl font-bold mb-4 text-center">💬 Local AI Chatbot </h1>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-gray-700">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`p-3 rounded-xl max-w-[80%] whitespace-pre-wrap break-words ${
                msg.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'
              }`}
            >
              {msg.content}
            </motion.div>
          ))}

          {isTyping && <div className="text-gray-400 animate-pulse">🤖 AI is typing...</div>}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask something..."
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
