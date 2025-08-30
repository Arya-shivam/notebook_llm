// components/SourcePanel.js
"use client";

import { useState } from 'react';
import { Plus, Search, LayoutGrid, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import AddSourceModal from './AddSourceModal';

import { Button } from "@/app/components/ui/button";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";

const SourceItem = ({ name, checked, onChange }) => (
  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 w-full">
      
    <Label className="hover:bg-accent/50 flex w-full items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
        <Checkbox
          id="toggle-2"
          checked={checked}
          onCheckedChange={onChange}
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">
            {name}
          </p>
        </div>
      </Label>
  </div>
);
export default function ContextPanel() {

// Get state and functions from the global context
  const { sources, toggleSource, toggleSelectAll } = useAppContext();
   const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal of add source

  // No more local useState! The context is the single source of truth.

  const allChecked = sources.length > 0 && sources.every(s => s.checked);

  return (
      <div className="flex flex-col border rounded-3xl p-4 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sources</h2>
        <LayoutGrid className="h-6 w-6 text-white" />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button variant="outline" size="default" className=" rounded-lg col-span-1" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add
        </Button>
      
        <Button variant="outline" size="default" className=" rounded-lg col-span-1">
            <Search className="h-4 w-4 mr-2" /> Discover
        </Button>

      </div>

      {/* Select All */}
      <div className="flex items-center justify-between p-2 mb-2">
        <label htmlFor="selectAll" className="text-sm font-medium text-white">Select all sources</label>
        <Checkbox
          id="selectAll"
          checked={allChecked}
          onCheckedChange={(checked) => toggleSelectAll(checked)}
        />
      </div>

      {/* Sources List */}
      <div className="flex-grow space-y-1 overflow-y-auto rounded-lg p-3 ">
        {sources.map(source => (
          <SourceItem
            key={source.id}
            name={source.name}
            checked={source.checked}
            onChange={() => toggleSource(source.id)}
          />
        ))}
      </div>
       {/* RENDER THE MODAL: Pass the state and setter function as props */}
      <AddSourceModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}