import { useState, useCallback } from 'react';
import type { GraphData, Node, Edge } from '../types';

export const useGraphManager = () => {
  const [graphs, setGraphs] = useState<GraphData[]>([]);
  const [graphCount, setGraphCount] = useState(0);

  // --- View Modes ---
  const [viewMode, setViewMode] = useState<'default' | 'grid4' | 'grid9'>('default');
  const [isSnappingEnabled, setIsSnappingEnabled] = useState(false);
  const [areAllVisible, setAreAllVisible] = useState(true);

  // --- Actions ---

  const addGraph = (newGraph: Omit<GraphData, 'id'>) => {
    let finalName=newGraph.name.trim()||`Graph ${graphCount + 1}`;
    const existingNames=graphs.map(g =>g.name);
if (existingNames.includes(finalName)) {
      let counter = 1;
while (existingNames.includes(`${finalName}.${counter}`)) {
        counter++;
  }
  finalName=`${finalName}.${counter}`;
   }
    const id=graphCount + 1;
  const graphWithId={...newGraph, name:finalName, id, isVisible:true};
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

  const requestClearAll = () => {
    if (window.confirm('Are you sure want to delete all graphs? This action cannot be undone.')) {
      setGraphs([]);
      setGraphCount(0);
    }
  };

  // --- VISIBILITY ---
  const toggleGraphVisibility = useCallback((id: number) => {
    setGraphs(prev => prev.map(g =>
      g.id === id ? { ...g, isVisible: !g.isVisible } : g
    ));
  }, []);

  const toggleAllVisibility = (shouldShow: boolean) => {
    setGraphs(prev => prev.map(g => ({ ...g, isVisible: shouldShow })));
  };

  // --- VIEW CONTROLS ---
  const toggleSnap = () => setIsSnappingEnabled(prev => !prev);

  const toggleViewMode = (mode: 'grid4' | 'grid9') => {
    setViewMode(prev => prev === mode ? 'default' : mode);
  };

  const renameGraph = (id: number, newName: string) => {
    setGraphs(prev => prev.map(g =>
      g.id === id ? { ...g, name: newName } : g
    ));
  };

  // --- EDGE & NODE MANIPULATION ---

  const addEdge = (graphId: number, source: string, target: string, weight: number) => {
    setGraphs(prev => prev.map(g => {
      if (g.id !== graphId) return g;

      // Check if nodes exist
      const sourceNode = g.nodes.find(n => n.id === source);
      const targetNode = g.nodes.find(n => n.id === target);

      if (!sourceNode || !targetNode) {
        alert(`Cannot add edge: Vertex ${!sourceNode ? source : target} does not exist.`);
        return g;
      }

      // Create new edge
      const newEdge: Edge = {
        id: `${source}-${target}`,

        // This ensures the renderer can immediately read .id to draw the arrow
        source: sourceNode,
        target: targetNode,

        weight: weight
      };

      return { ...g, edges: [...g.edges, newEdge] };
    }));
  };

  const deleteEdge = (graphId: number, edgeId: string) => {
    setGraphs(prev => prev.map(g => {
      if (g.id !== graphId) return g;
      return { ...g, edges: g.edges.filter(e => e.id !== edgeId) };
    }));
  };

  const deleteVertex = (graphId: number, nodeId: string) => {
    setGraphs(prev => prev.map(g => {
      if (g.id !== graphId) return g;

      // 1. Remove the vertex
      const updatedNodes = g.nodes.filter(n => n.id !== nodeId);

      // 2. Remove edges connected to this vertex
      const updatedEdges = g.edges.filter(e => {
        // Handle D3 mutation (Source/Target might be objects OR strings)
        const sourceId = typeof e.source === 'object' ? (e.source as any).id : e.source;
        const targetId = typeof e.target === 'object' ? (e.target as any).id : e.target;

        return sourceId !== nodeId && targetId !== nodeId;
      });

      return { ...g, nodes: updatedNodes, edges: updatedEdges };
    }));
  };

  const addVertex = (graphId: number, nodeId: string, x: number, y: number) => {
    setGraphs(prev => prev.map(g => {
      if (g.id !== graphId) return g;

      // Prevent duplicate IDs
      if (g.nodes.some(n => n.id === nodeId)) {
        alert(`Node "${nodeId}" already exists.`);
        return g;
      }

      const newNode: Node = {
        id: nodeId,
        x: x,
        y: y
      };

      return { ...g, nodes: [...g.nodes, newNode] };
    }));
  };

  const updateEdgeWeight = (graphId: number, edgeId: string, newWeight: number) => {
    setGraphs(prev => prev.map(g => {
      if (g.id !== graphId) return g;
      return {
        ...g,
        edges: g.edges.map(e => e.id === edgeId ? { ...e, weight: newWeight } : e)
      };
    }));
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
    addEdge,
    deleteEdge,
    deleteVertex,
    addVertex,
    updateEdgeWeight
  };
};