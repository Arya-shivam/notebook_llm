// app/components/ChatInterface.js
"use client";

// import { useChat } from 'ai/react';
// import { useAppContext } from '../context/AppContext';

export default function ChatInterface() {
  // const { activeSource } = useAppContext();
  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   // This points to the Next.js API route we just created
  //   api: '/api/chat',
  //   // Send additional data to your API route
  //   body: {
  //     activeSource,
  //   },
  // });

  return (
    <div className="flex flex-col bg-black h-full">
      <div className="flex-grow border rounded-lg p-4 mb-4">
        <p className="text-gray-500">Chat messages will appear here...</p>
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        className="w-full p-3 border rounded-lg"
      />
    </div>
  );
}