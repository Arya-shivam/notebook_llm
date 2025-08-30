// components/SourcePanel.js
"use client";

import { useState } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddSourceModal from './AddSourceModal';

const SourceItem = ({ name, checked, onChange }) => (
  <div className="flex items-center p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
    <FileText className="h-5 w-5 mr-3 text-red-400" />
    <span className="flex-grow text-sm truncate">{name}</span>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 rounded bg-white/20 border-white/30 text-indigo-400 focus:ring-indigo-500"
    />
  </div>
);
export default function ContextPanel() {

// Get state and functions from the global context
  const { sources, toggleSource, toggleSelectAll } = useAppContext();
   const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal of add source

  // No more local useState! The context is the single source of truth.

  const allChecked = sources.length > 0 && sources.every(s => s.checked);

  return (
    <div className="h-full flex flex-col rounded-xl glass-card">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-semibold">Sources</h2>
      </div>

      <div className="flex flex-col flex-grow p-4 space-y-4">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </button>
          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors">
            <Search className="h-4 w-4 mr-2" />
            Discover
          </button>
        </div>

        {/* Select All */}
        <div className="flex items-center justify-between p-2">
          <label className="text-sm font-medium text-gray-300">Select all sources</label>
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => toggleSelectAll(e.target.checked)}
            className="h-4 w-4 rounded bg-white/20 border-white/30 text-indigo-400 focus:ring-indigo-500"
          />
        </div>

        {/* Sources List */}
        <div className="flex-grow overflow-y-auto pr-2">
          <div className="space-y-2">
            {sources.map(source => (
              <SourceItem
                key={source.id}
                name={source.name}
                checked={source.checked}
                onChange={() => toggleSource(source.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RENDER THE MODAL: Pass the state and setter function as props */}
      <AddSourceModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}