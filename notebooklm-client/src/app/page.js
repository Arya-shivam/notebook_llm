// app/page.js
import ContextPanel from './components/ContextPanel';
import UploadPanel from './components/UploadPanel';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  return (
     <main className="flex h-screen w-full bg-black">
      {/* Left Panel: Upload Section (25% width) */}
      <div className="w-[25%] p-4 border-r bg-black">
        <UploadPanel />
      </div>

      {/* Middle Panel: Chat Interface (takes remaining space) */}
      <div className="flex-grow p-4 bg-black">
        <ChatInterface />
      </div>

      {/* Right Panel: Available Context (25% width) */}
      <div className="w-[25%] p-4 border-l bg-black">
        <ContextPanel />
      </div>
    </main>
  );
}