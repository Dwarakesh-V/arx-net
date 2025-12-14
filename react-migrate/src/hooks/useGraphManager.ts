import { useState, useCallback } from 'react';
import type { GraphData } from '../types';

export const useGraphManager = () => {
  // --- REPLACING Lines 69-74 (Graph Management) ---
  const [graphs, setGraphs] = useState<GraphData[]>([]);
  const [graphCount, setGraphCount] = useState(0);

  // --- REPLACING Lines 30-38 (View Modes) ---
  // Instead of separate booleans (view4gen, view9gen), use one mode
  const [viewMode, setViewMode] = useState<'default' | 'grid4' | 'grid9'>('default');
  const [isSnapping, setIsSnapping] = useState(false);
  const [areAllVisible, setAreAllVisible] = useState(true);

  // --- Actions (Functions to modify state) ---

  const addGraph = (newGraph: Omit<GraphData, 'id'>) => {
    const id = graphCount + 1;
    const graphWithId = { ...newGraph, id };
    
    setGraphs(prev => [...prev, graphWithId]);
    setGraphCount(id);
  };

  const clearAllGraphs = useCallback(() => {
    setGraphs([]);
    setGraphCount(0);
  }, []);

  const toggleSnap = () => setIsSnapping(prev => !prev);

  const toggleViewMode = (mode: 'grid4' | 'grid9') => {
    // Toggle logic: if clicking the active mode, turn it off
    setViewMode(prev => prev === mode ? 'default' : mode);
  };
  // ... existing state

  // New: Toggle visibility for ALL graphs
  const toggleAllVisibility = (shouldShow: boolean) => {
    setGraphs(prev => prev.map(g => ({ ...g, isMinimized: !shouldShow })));
  };

  // New: Clear with confirmation
  const requestClearAll = () => {
    if (window.confirm('Are you sure want to delete all graphs? This action cannot be undone.')) {
      setGraphs([]);
    }
  };

  return {
    graphs,
    graphCount,
    addGraph,
    clearAllGraphs,
    viewMode,
    toggleViewMode,
    isSnapping,
    toggleSnap,
    areAllVisible,
    setAreAllVisible,
    toggleAllVisibility,
    requestClearAll
  };
};