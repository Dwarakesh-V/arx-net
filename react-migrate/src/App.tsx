import { useState } from 'react';
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
    graphs, viewMode, toggleViewMode,
    requestClearAll, toggleAllVisibility, toggleSnap,
    addGraph, removeGraph
  } = useGraphManager();

  const [showAbout, setShowAbout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. Handlers
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
      isWeighted: data.isWeighted
    });
  };

  const handleRandomGraph = (config: any) => {
    const data = generateRandomGraphData(config);
    handleNewGraph({
      ...data,
      name: `Random ${graphs.length + 1}`,
      isDirected: config.isDirected,
      isWeighted: config.isWeighted
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
          onLayoutChange={toggleViewMode} 
          onSnapToggle={toggleSnap}
          onClearAll={requestClearAll}
          onToggleVisibility={() => toggleAllVisibility(true)} 
        />
      </div>

      {/* --- Main Workspace --- */}
      <main className="main-workspace" style={{ position: 'relative' }}>
        
        {/* FIX: Floating Open Sidebar Button (Only visible when sidebar is closed) */}
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

        {graphs.map((graph, index) => {
             const forcedLayout = getGridPosition(index, viewMode);

             return (
               <GraphWindow
                 key={graph.id}
                 id={graph.id}
                 title={graph.name}
                 initialX={forcedLayout ? forcedLayout.x : (graph.x || 100 + (index * 30))}
                 initialY={forcedLayout ? forcedLayout.y : (graph.y || 100 + (index * 30))}
                 isActive={true} 
                 onFocus={() => {}} 
                 onClose={() => { removeGraph(graph.id); }}
                 isLocked={viewMode !== 'default'} 
                 nodes={graph.nodes}
                 edges={graph.edges}
                 isDirected={graph.isDirected}
                 isWeighted={graph.isWeighted}
               />
             );
        })}
      </main>

      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />
    </div>
  );
}

export default App;