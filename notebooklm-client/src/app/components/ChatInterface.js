// app/components/ChatInterface.js
"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
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
    <Card className="flex flex-col h-full w-full">
      <CardHeader>
        <CardTitle>Chat with Docs</CardTitle>
        <p className="text-sm text-muted-foreground truncate">
          {activeSourceNames ? `Asking about: ${activeSourceNames}` : "Select a source to begin"}
        </p>
      </CardHeader>

      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="flex flex-col space-y-4">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col p-3 rounded-lg max-w-[80%] ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground self-end'
                    : 'bg-muted self-start'
                }`}
              >
                <span className="font-bold mb-1">
                  {m.role === 'user' ? 'You' : 'AI'}
                </span>
                {m.content}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={sources.filter(s => s.checked).length === 0 || isLoading}
          />
          <Button type="submit" disabled={sources.filter(s => s.checked).length === 0 || isLoading}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}