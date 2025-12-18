import React, { useState, useEffect } from 'react';

// Define the shape of the random configuration
interface RandomGraphConfig {
  vertexCount: number;
  edgeCount: number;
  minWeight: number;
  maxWeight: number;
  ensureConnected: boolean;
  allowSelfLoops: boolean;
  allowDuplicates: boolean;
  isDirected: boolean;
  isWeighted: boolean;
}

interface GraphGeneratorProps {
  onGenerate: (data: {
    name: string;
    rawVertices: string;
    rawEdges: string;
    isDirected: boolean;
    isWeighted: boolean;
  }) => void;
  onGenerateRandom: (config: RandomGraphConfig) => void;
}

export const GraphGenerator: React.FC<GraphGeneratorProps> = ({ onGenerate, onGenerateRandom }) => {
  // --- Standard Inputs ---
  const [graphName, setGraphName] = useState('');
  const [verticesInput, setVerticesInput] = useState('');
  const [edgesInput, setEdgesInput] = useState('AB7, AA6, BA9, AC5, AD3');
  const [isDirected, setIsDirected] = useState(true);
  const [isWeighted, setIsWeighted] = useState(true);

  // --- Random Graph Inputs (Missing in your version) ---
  const [vertexCount, setVertexCount] = useState(10);
  const [edgeCount, setEdgeCount] = useState(34);
  const [minWeight, setMinWeight] = useState(1);
  const [maxWeight, setMaxWeight] = useState(20);
  
  const [ensureConnected, setEnsureConnected] = useState(false);
  const [allowSelfLoops, setAllowSelfLoops] = useState(false);
  const [allowDuplicates, setAllowDuplicates] = useState(false);

  // --- Visual Feedback (The "MinMaxRec" logic) ---
  const [maxRec, setMaxRec] = useState(90);

  useEffect(() => {
    // Calculate max possible edges based on nodes and direction
    // Formula: Directed = n*(n-1), Undirected = n*(n-1)/2
    // If self-loops allowed: Directed = n*n, Undirected = n*(n+1)/2
    let max = 0;
    if (isDirected) {
      max = allowSelfLoops ? vertexCount * vertexCount : vertexCount * (vertexCount - 1);
    } else {
      max = allowSelfLoops ? (vertexCount * (vertexCount + 1)) / 2 : (vertexCount * (vertexCount - 1)) / 2;
    }
    setMaxRec(max);
  }, [vertexCount, isDirected, allowSelfLoops]);

  // --- Handlers ---
  const handleGenerateClick = () => {
    onGenerate({
      name: graphName,
      rawVertices: verticesInput,
      rawEdges: edgesInput,
      isDirected,
      isWeighted
    });
  };

  const handleRandomClick = () => {
    onGenerateRandom({
      vertexCount,
      edgeCount,
      minWeight,
      maxWeight,
      ensureConnected,
      allowSelfLoops,
      allowDuplicates,
      isDirected,
      isWeighted
    });
  };

  return (
    <div className="graphGenerator" id="graphGenerator">
      <h1 id="instructions">Arx Net</h1>

      <div className="sourceInput">
        <input 
          type="text" 
          placeholder="Graph name (Can be left blank)"
          value={graphName}
          onChange={(e) => setGraphName(e.target.value)}
        /> <br />
        
        <input 
          type="text" 
          placeholder="E.G., A, B, C" 
          style={{ textTransform: 'uppercase' }}
          value={verticesInput}
          onChange={(e) => setVerticesInput(e.target.value)}
        /> <br />
        
        <input 
          type="text" 
          placeholder="E.G., AB5, 12-3.14" 
          autoComplete="off"
          spellCheck={false}
          value={edgesInput}
          onChange={(e) => setEdgesInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerateClick()}
          style={{ textTransform: 'uppercase' }}
        /> <br />

        <label>
          <input type="checkbox" checked={isDirected} onChange={(e) => setIsDirected(e.target.checked)} /> Directed
        </label> <br />
        <label>
          <input type="checkbox" checked={isWeighted} onChange={(e) => setIsWeighted(e.target.checked)} /> Weighted
        </label> <br />

        <button id="generateGraph" onClick={handleGenerateClick}>Generate Graph</button>
        
        {/* --- Random Graph Section (Restored) --- */}
        <div className="input-row">
          <label>Vertex count:</label>
          <input type="number" value={vertexCount} onChange={(e) => setVertexCount(Number(e.target.value))} />
          
          <label>Edge count:</label>
          <input type="number" value={edgeCount} onChange={(e) => setEdgeCount(Number(e.target.value))} />
        </div>

        <div className="input-row">
          <label>Min weight:</label>
          <input type="number" value={minWeight} onChange={(e) => setMinWeight(Number(e.target.value))} />
          
          <label>Max weight:</label>
          <input type="number" value={maxWeight} onChange={(e) => setMaxWeight(Number(e.target.value))} />
        </div>

        <label><input type="checkbox" checked={ensureConnected} onChange={(e) => setEnsureConnected(e.target.checked)} /> Connected</label><br />
        <label><input type="checkbox" checked={allowSelfLoops} onChange={(e) => setAllowSelfLoops(e.target.checked)} /> Self loops</label><br />
        <label><input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} /> Duplicate edges</label><br />
        <label><input type="checkbox" checked={isDirected} onChange={(e) => setIsDirected(e.target.checked)} /> Directed</label><br />
        <label><input type="checkbox" checked={isWeighted} onChange={(e) => setIsWeighted(e.target.checked)} /> Weighted</label><br />

        <p id="minMaxRec">
           Max edge count for current vertex count: <b style={{ color: '#ffc66d' }}> {maxRec} </b>
        </p>
        
        <button id="generateRandomGraph" onClick={handleRandomClick}>
          Generate random Graph
        </button>
      </div>
    </div>
  );
};