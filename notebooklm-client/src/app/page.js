// app/page.js
import { AppProvider } from './context/AppContext';
import ContextPanel from './components/ContextPanel.js';
import ChatInterface from './components/ChatInterface.js';

export default function Home() {
  return (
    <AppProvider>
      <div className="gradient-bg min-h-screen text-white">
        <main className="flex h-screen w-full">
          {/* Left Panel - Sources */}
          <div className="w-[280px] p-4">
            <ContextPanel />
          </div>

          {/* Middle Panel - Chat Interface */}
          <div className="flex-grow p-4">
            <ChatInterface />
          </div>

          {/* Right Panel - Document Viewer (placeholder for now) */}
        </main>
      </div>
    </AppProvider>
  );
}