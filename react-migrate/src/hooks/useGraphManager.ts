import { useState, useCallback } from 'react';
import type { GraphData } from '../types';

export const useGraphManager = () => {
  // --- REPLACING Lines 69-74 (Graph Management) ---
  const [graphs, setGraphs] = useState<GraphData[]>([]);
  const [graphCount, setGraphCount] = useState(0);

  // --- REPLACING Lines 30-38 (View Modes) ---
  // Instead of separate booleans (view4gen, view9gen), use one mode
  const [viewMode, setViewMode] = useState<'default' | 'grid4' | 'grid9'>('default');
  const [isSnappingEnabled, setIsSnappingEnabled] = useState(false);
  const [areAllVisible, setAreAllVisible] = useState(true);

  // --- Actions (Functions to modify state) ---

  const addGraph = (newGraph: Omit<GraphData, 'id'>) => {
    const id = graphCount + 1;
    const graphWithId = { ...newGraph, id };
    
    setGraphs(prev => [...prev, graphWithId]);
    setGraphCount(id);
  };

  const removeGraph = (id: number) => {
    setGraphs(prev => prev.filter(g => g.id !== id));
  };

  const clearAllGraphs = useCallback(() => {
    setGraphs([]);
    setGraphCount(0);
  }, []);

  const toggleGraphVisibility = useCallback((id: number) => {
    setGraphs(prev => prev.map(g => 
      g.id === id ? { ...g, isVisible: !g.isVisible } : g
    ));
  }, []);

  const toggleSnap = () => setIsSnappingEnabled(prev => !prev);

  const toggleViewMode = (mode: 'grid4' | 'grid9') => {
    // Toggle logic: if clicking the active mode, turn it off
    setViewMode(prev => prev === mode ? 'default' : mode);
  };
  // ... existing state

  // New: Toggle visibility for ALL graphs
  const toggleAllVisibility = (shouldShow: boolean) => {
    setGraphs(prev => prev.map(g => ({ ...g, isVisible: shouldShow })));
  };

  // New: Clear with confirmation
  const requestClearAll = () => {
    if (window.confirm('Are you sure want to delete all graphs? This action cannot be undone.')) {
      setGraphs([]);
    }
  };

  // NEW: Add this function
  const renameGraph = (id: number, newName: string) => {
    setGraphs(prev => prev.map(g => 
      g.id === id ? { ...g, name: newName } : g
    ));
  };

  return {
    graphs,
    graphCount,
    addGraph,
    removeGraph,
    clearAllGraphs,
    viewMode,
    toggleViewMode,
    isSnappingEnabled,
    toggleSnap,
    areAllVisible,
    setAreAllVisible,
    toggleAllVisibility,
    requestClearAll,
    renameGraph,
    toggleGraphVisibility,
  };
};