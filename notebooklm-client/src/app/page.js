// app/page.js
import ContextPanel from './components/ContextPanel.js';

import ChatInterface from './components/ChatInterface.js';

export default function Home() {
  return (
     <main className="flex h-screen w-full  text-white  bg-black">
      {/* left Panel: adding source and all Available Context (25% width) */}
      <div className="w-[25%] p-4 border-r bg-black">
        <ContextPanel />
      </div>

      {/* Middle Panel: Chat Interface (takes remaining space) */}
      <div className="flex-grow p-4 bg-black">
        <ChatInterface />
      </div>
      
    </main>
  );
}