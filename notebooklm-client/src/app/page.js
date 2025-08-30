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
          <div className="w-[35%] p-4">
            <div className="h-full w-full rounded-xl glass-card flex flex-col">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Document Viewer</h2>
                  <p className="text-sm text-gray-400">Select a document to preview</p>
                </div>
                <button className="text-sm font-medium text-indigo-300 hover:text-indigo-200">✨ Get Takeaways</button>
              </div>
              <div className="p-6 overflow-y-auto">
                <p className="text-gray-400 text-center mt-20">Document preview will appear here</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AppProvider>
  );
}