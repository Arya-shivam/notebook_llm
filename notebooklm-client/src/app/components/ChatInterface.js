// app/components/ChatInterface.js
"use client";

import { useChat } from '@ai-sdk/react' // Import the useChat hook from the ai/react packag;
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/app/components/ui/card";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { SendHorizonal } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function ChatInterface() {
  const { sources } = useAppContext();
  
  // Get the names of the currently checked sources
  const activeSourceNames = sources
    .filter(source => source.checked)
    .map(source => source.name)
    .join(', ');

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      // Send the active source names to the backend
      activeSources: sources.filter(source => source.checked),
    }
  });

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
            onChange={handleInputChange}
            placeholder="Type your message..."
            disabled={sources.filter(s => s.checked).length === 0}
          />
          <Button type="submit" disabled={sources.filter(s => s.checked).length === 0}>
            <SendHorizonal className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}