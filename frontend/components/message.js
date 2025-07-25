export default function Message({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`my-2 px-4 py-2 rounded max-w-[80%] ${isUser ? 'bg-blue-200 self-end ml-auto' : 'bg-gray-200 self-start mr-auto'}`}>
      <span className="block font-semibold text-sm text-gray-700">{isUser ? 'You' : 'Assistant'}</span>
      <p className="text-gray-800 whitespace-pre-wrap">{content}</p>
    </div>
  );
}
import React from 'react';