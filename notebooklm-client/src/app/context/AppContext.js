// app/context/AppContext.js
"use client";

import { createContext, useState, useContext } from 'react';

// 1. Create the context
const AppContext = createContext();

// 2. Create a provider component
export function AppProvider({ children }) {
  const [sources, setSources] = useState([]); // This will hold our list of indexed sources

  // This function will be called from the UploadPanel to add a new source
  const addSource = (newSource) => {
    // We use a function here to safely update the state based on the previous state
    setSources(prevSources => [...prevSources, newSource]);
  };

  const value = {
    sources,    // The list of sources
    addSource,  // The function to add a new source
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// 3. Create a custom hook to easily use the context
export function useAppContext() {
  return useContext(AppContext);
}