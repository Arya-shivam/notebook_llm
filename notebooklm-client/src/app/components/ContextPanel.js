// components/SourcePanel.js
"use client";

import { useAppContext } from '../context/AppContext';

export default function ContextPanel() {
  const { sources, setActiveSource, addSource } = useAppContext();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);

    // Call your backend!
    const response = await fetch('http://localhost:3000/upload/file', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    
    // Add the new source to the global state
    addSource({ name: result.collectionName, type: 'pdf' });
  };
  
  // You would also have functions here for URL and text indexing...

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Available Context</h2>
      <ul className="space-y-2">
        {/* This will be dynamic later */}
        <li className="p-2 border rounded-lg bg-black">example-document.pdf</li>
        <li className="p-2 border rounded-lg bg-black">youtube-video-title</li>
      </ul>
    </div>
  );
}