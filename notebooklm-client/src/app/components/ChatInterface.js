// app/components/ChatInterface.js
"use client";

import { useState } from 'react';
import { SendHorizonal } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ChatInterface() {
  const { sources } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get the names of the currently checked sources
  const activeSourceNames = sources
    .filter(source => source.checked)
    .map(source => source.name)
    .join(', ');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const responseText = await response.text();
      const aiMessage = { id: Date.now() + 1, role: 'assistant', content: responseText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { id: Date.now() + 1, role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full rounded-xl glass-card">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold">Chat with Docs</h2>
        <p className="text-sm text-gray-400 truncate">
          {activeSourceNames ? `Asking about: ${activeSourceNames}` : "Select a source to begin"}
        </p>
      </div>

      {/* ✨ GEMINI FEATURE: Suggested Questions ✨ */}
      <div className="p-4 border-b border-white/10 text-center">
        <button className="text-sm font-medium text-indigo-300 hover:text-indigo-200">✨ Get Suggestions</button>
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          <button className="text-xs bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">Compare normalization techniques</button>
          <button className="text-xs bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">What is a primary key?</button>
          <button className="text-xs bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors">Explain the ER model</button>
        </div>
      </div>

      <div className="flex-grow overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          <div className="flex flex-col space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col p-3 rounded-lg max-w-[80%] glass-card self-start border-0">
                <span className="font-bold mb-1">AI</span>
                <p>Hello! How can I help you with the selected documents today?</p>
              </div>
            )}
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col p-3 rounded-lg max-w-[80%] ${
                  m.role === 'user'
                    ? 'bg-indigo-500 text-white self-end shadow-lg'
                    : 'glass-card self-start border-0'
                }`}
              >
                <span className="font-bold mb-1">
                  {m.role === 'user' ? 'You' : 'AI'}
                </span>
                <p>{m.content}</p>
              </div>
            ))}
            {isLoading && (
              <div className="flex flex-col p-3 rounded-lg max-w-[80%] glass-card self-start border-0">
                <span className="font-bold mb-1">AI</span>
                <span>Thinking...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/10">
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={sources.filter(s => s.checked).length === 0 || isLoading}
            className="flex h-10 w-full rounded-md border-none bg-white/10 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            disabled={sources.filter(s => s.checked).length === 0 || isLoading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-indigo-500 text-white hover:bg-indigo-600 h-10 px-4 py-2 transition-colors"
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}