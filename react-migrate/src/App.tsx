import { useState } from 'react';
import './index.css'; 

// --- Import Components ---
import { GraphGenerator } from './components/GraphGenerator';
import { GraphWindow } from './components/GraphWindow';
import { Outliner } from './components/Outliner';
import { AboutModal } from './components/AboutModal';

// --- Import Logic & Hooks ---
import { useGraphManager } from './hooks/useGraphManager'; // FIX: This solves "Cannot find name useGraphManager"
import { parseEdges } from './lib/graphUtils';
import { getGridPosition } from './lib/layoutUtils';
import { generateRandomGraphData } from './lib/randomGraphGenerator';

function App() {
  // 1. Hooks
  const { 
    graphs, viewMode, toggleViewMode, 
    requestClearAll, toggleAllVisibility, toggleSnap,
    addGraph // FIX: Destructure addGraph here
  } = useGraphManager();

  const [showAbout, setShowAbout] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. Handlers
  const handleNewGraph = (data: any) => {
    // Parse the input string "AB5, BC4" into real edge objects
    const edges = parseEdges(data.rawEdges, data.isDirected);
    
    // Extract unique nodes
    const nodeIds = new Set<string>();
    edges.forEach(e => {
        // Handle potentially object-based sources if re-parsing existing data
        const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
        const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
        nodeIds.add(s);
        nodeIds.add(t);
    });

    // Add explicit vertices from input
    if (data.rawVertices) {
        data.rawVertices.split(',').forEach((v: string) => {
            const trimmed = v.trim();
            if (trimmed) nodeIds.add(trimmed);
        });
    }

    // Create Nodes with random positions
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
    // Reuse the handler above to process the random string data
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
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} title="Toggle Sidebar">
             <img src="/images/sidebarclose.png" alt="Toggle" />
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
      <main className="main-workspace">
        {graphs.map((graph, index) => {
             // Calculate grid position if in 4-grid or 9-grid mode
             const forcedLayout = getGridPosition(index, viewMode);

             return (
               <GraphWindow
                 key={graph.id}
                 id={graph.id}
                 title={graph.name}
                 // Use forced layout X/Y if active, otherwise use defaults
                 initialX={forcedLayout ? forcedLayout.x : (graph.x || 100 + (index * 30))}
                 initialY={forcedLayout ? forcedLayout.y : (graph.y || 100 + (index * 30))}
                 isActive={true} 
                 onFocus={() => {}} // You can add setFocusedId(graph.id) here later
                 onClose={() => { /* Add removeGraph(graph.id) to hook later */ }}
                 isLocked={viewMode !== 'default'} 
                 
                 // Data Props
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