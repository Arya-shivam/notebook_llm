// app/context/AppContext.js
"use client";

import { createContext, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid'; // We'll use uuid to give each source a unique id

// 1. Create the context
const AppContext = createContext();

// 2. Create a provider component
export function AppProvider({ children }) {
  // State is now an array of source objects with an id, name, and checked status
  const [sources, setSources] = useState([]);

  // Function to add a new source (e.g., from the UploadPanel)
  const addSource = (sourceData) => {
    const newSource = {
      id: sourceData.id || uuidv4(), // Use provided ID or generate a unique ID
      name: sourceData.name || sourceData,
      type: sourceData.type || 'unknown',
      checked: sourceData.checked !== undefined ? sourceData.checked : true, // New sources are checked by default
    };
    setSources(prevSources => [...prevSources, newSource]);
  };

  // Function to toggle the checked status of a single source
  const toggleSource = (id) => {
    setSources(sources.map(s =>
      s.id === id ? { ...s, checked: !s.checked } : s
    ));
  };

  // Function to handle "Select All"
  const toggleSelectAll = (isChecked) => {
    setSources(sources.map(s => ({ ...s, checked: isChecked })));
  };


  const value = {
    sources,
    addSource,
    toggleSource,
    toggleSelectAll,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// 3. Create a custom hook to easily use the context
export function useAppContext() {
  return useContext(AppContext);
}