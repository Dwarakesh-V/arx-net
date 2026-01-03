import { useState, useRef } from 'react';
import './index.css';

// --- Import Components ---
import { GraphGenerator } from './components/GraphGenerator';
import { GraphWindow } from './components/GraphWindow';
import { Outliner } from './components/Outliner';
import { AboutModal } from './components/AboutModal';

// --- Import Logic & Hooks ---
import { useGraphManager } from './hooks/useGraphManager';
import { parseEdges } from './lib/graphUtils';
import { getGridPosition } from './lib/layoutUtils';
import { generateRandomGraphData } from './lib/randomGraphGenerator';

function App() {
  // 1. Hooks
  const {
    graphs, viewMode, toggleViewMode, isSnappingEnabled, areAllVisible, addVertex,
    requestClearAll, toggleAllVisibility, toggleSnap, addEdge, deleteEdge, deleteVertex,
    addGraph, removeGraph, renameGraph, setAreAllVisible, toggleGraphVisibility,
    updateEdgeWeight, updateGraphPosition
  } = useGraphManager();

  const [showAbout, setShowAbout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [focusedGraphId, setFocusedGraphId] = useState<number | null>(null);

  const mainRef = useRef<HTMLElement>(null);

  // 2. Handlers

  // Helper to Focus and optionally Center
  const handleFocus = (id: number, centerMode: 'none' | 'if-switch' | 'always' = 'none') => {
    const graph = graphs.find(g => g.id === id);
    if (!graph) return;

    // 1. If Switch or Always, we might center
    // Check if we need to center
    let shouldCenter = false;

    if (centerMode === 'always') shouldCenter = true;
    if (centerMode === 'if-switch') shouldCenter = true; // Always center on explicit content click, even if already focused

    // 2. Ensure visible (if centering or focusing via sidebar imply expansion?)
    // User said: "When an minimized graph is clicked, it should expand and be centered."
    // Sidebar click uses 'always', so we check visibility.
    if (shouldCenter && !graph.isVisible) {
      toggleGraphVisibility(id);
    }

    // 3. Center if needed
    if (shouldCenter) {
      if (mainRef.current) {
        const parentW = mainRef.current.clientWidth;
        const parentH = mainRef.current.clientHeight;
        const w = 600; // approximation of default width
        const h = 450; // approximation of default height

        // Simple Center
        const x = (parentW - w) / 2;
        const y = (parentH - h) / 2;

        updateGraphPosition(id, x, y);
      }
    }

    // 4. Set Focus
    setFocusedGraphId(id);
  };

  const handleNewGraph = (data: any) => {
    // Parse input
    const edges = parseEdges(data.rawEdges, data.isDirected);

    // Extract unique nodes
    const nodeIds = new Set<string>();
    edges.forEach(e => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      nodeIds.add(s);
      nodeIds.add(t);
    });

    // Add manual vertices
    if (data.rawVertices) {
      data.rawVertices.split(',').forEach((v: string) => {
        const trimmed = v.trim();
        if (trimmed) nodeIds.add(trimmed);
      });
    }

    // Create Nodes with random positions to prevent stacking
    const nodes = Array.from(nodeIds).map(id => ({
      id,
      x: Math.random() * 400 + 50,
      y: Math.random() * 300 + 50
    }));

    // Add to state
    addGraph({
      name: data.name,
      nodes,
      edges,
      isDirected: data.isDirected,
      isWeighted: data.isWeighted,
      isVisible: true
    });
  };

  const handleRandomGraph = (config: any) => {
    const { nodes, edges } = generateRandomGraphData(config);

    // B. Add directly to state (Skipping parseEdges)
    addGraph({
      name: `Random ${graphs.length + 1}`,
      nodes,
      edges,
      isDirected: config.isDirected,
      isWeighted: config.isWeighted,
      isVisible: true
    });
  };

  return (
    <div className="app-container">
      {/* --- Sidebar --- */}
      <div className={`container ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="window-header" style={{ marginBottom: '10px' }}>
          <button onClick={() => setShowAbout(true)} title="About">
            <img src="/images/about.png" alt="About" />
          </button>

          {/* Close Sidebar Button (Inside Sidebar) */}
          <button onClick={() => setIsSidebarOpen(false)} title="Close Sidebar">
            <img src="/images/sidebarclose.png" alt="Close" />
          </button>
        </div>

        <GraphGenerator
          onGenerate={handleNewGraph}
          onGenerateRandom={handleRandomGraph}
        />

        <hr style={{ color: '#444', width: '100%', margin: '15px 0' }} />

        <Outliner
          // Data Props
          graphs={graphs}
          activeGraphId={focusedGraphId}
          currentLayout={viewMode}
          isSnapping={isSnappingEnabled}
          areAllVisible={areAllVisible}
          // View Controls
          onLayoutChange={toggleViewMode}
          onSnapToggle={toggleSnap}
          onClearAll={requestClearAll}
          onToggleVisibility={() => {
            setAreAllVisible(!areAllVisible);
            toggleAllVisibility(!areAllVisible);
          }}
          toggleGraphVisibility={toggleGraphVisibility}

          // Action Props
          onSelectGraph={(id) => handleFocus(id, 'always')}
          onDeleteGraph={(id) => removeGraph(id)}
          onRenameGraph={(id, newName) => renameGraph(id, newName)}
        />
      </div>

      {/* --- Main Workspace --- */}
      <main ref={mainRef} className="main-workspace" style={{ position: 'relative' }}>

        {/*Floating Open Sidebar Button (Only visible when sidebar is closed) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            title="Open Sidebar"
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 200,
              background: 'var(--bg-secondary)',
              border: '1px solid #444',
              borderRadius: '4px',
              padding: '5px',
              cursor: 'pointer'
            }}
          >
            <img
              src="/images/sidebarclose.png"
              alt="Open"
              style={{ transform: 'rotate(180deg)', display: 'block' }}
            />
          </button>
        )}

        {graphs
          .filter(graph => graph.isVisible)  // Only render visible graphs
          .map((graph, index) => {
            const forcedLayout = getGridPosition(index, viewMode);
            return (
              <GraphWindow
                key={graph.id}
                id={graph.id}
                title={graph.name}
                initialX={forcedLayout ? forcedLayout.x : (graph.x || 100 + (index * 30))}
                initialY={forcedLayout ? forcedLayout.y : (graph.y || 100 + (index * 30))}
                isActive={focusedGraphId === graph.id}
                onFocus={(shouldCenter) => handleFocus(graph.id, shouldCenter ? 'if-switch' : 'none')}
                onClose={() => { removeGraph(graph.id); }}
                onMinimize={() => { toggleGraphVisibility(graph.id); }}
                onAddEdge={(source, target, weight) => { addEdge(graph.id, source, target, weight); }}
                onDeleteEdge={(edgeId) => { deleteEdge(graph.id, edgeId); }}
                onDeleteVertex={(nodeId) => { deleteVertex(graph.id, nodeId); }}
                onAddVertex={(newNode, x, y) => { addVertex(graph.id, newNode, x, y); }}
                onUpdateEdgeWeight={(edgeId, newWeight) => { updateEdgeWeight(graph.id, edgeId, newWeight); }}
                nodes={graph.nodes}
                edges={graph.edges}
                isDirected={graph.isDirected}
                isWeighted={graph.isWeighted}
                isSnapped={isSnappingEnabled}
                viewMode={viewMode}
                initialWidth={forcedLayout ? forcedLayout.width : undefined}
                initialHeight={forcedLayout ? forcedLayout.height : undefined}
              />
            );
          })}
      </main>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}

export default App;