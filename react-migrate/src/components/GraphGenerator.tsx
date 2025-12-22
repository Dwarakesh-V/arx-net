import React, { useState, useEffect, useRef } from 'react';

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
  // --- Inputs ---
  const [graphName, setGraphName] = useState('');
  const [verticesInput, setVerticesInput] = useState('');
  const [edgesInput, setEdgesInput] = useState('AB7, AA6, BA9, AC5, AD3');
  const [isDirected, setIsDirected] = useState(true);
  const [isWeighted, setIsWeighted] = useState(true);

  // --- Random Config ---
  const [vertexCount, setVertexCount] = useState(10);
  const [edgeCount, setEdgeCount] = useState(34);
  const [minWeight, setMinWeight] = useState(1);
  const [maxWeight, setMaxWeight] = useState(20);
  const [ensureConnected, setEnsureConnected] = useState(false);
  const [allowSelfLoops, setAllowSelfLoops] = useState(false);
  const [allowDuplicates, setAllowDuplicates] = useState(false);

  const [maxRec, setMaxRec] = useState(90);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let max = 0;
    if (isDirected) {
      max = allowSelfLoops ? vertexCount * vertexCount : vertexCount * (vertexCount - 1);
    } else {
      max = allowSelfLoops ? (vertexCount * (vertexCount + 1)) / 2 : (vertexCount * (vertexCount - 1)) / 2;
    }
    setMaxRec(max);
  }, [vertexCount, isDirected, allowSelfLoops]);

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
      vertexCount, edgeCount, minWeight, maxWeight,
      ensureConnected, allowSelfLoops, allowDuplicates,
      isDirected, isWeighted
    });
  };

  // --- UPDATED FILE UPLOAD LOGIC ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Split into lines and remove empty ones
      let lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length === 0) return;

      // 1. DETECT AND REMOVE METADATA FOOTER
      // Check if the last line contains our metadata signature
      const lastLine = lines[lines.length - 1];
      if (lastLine.toLowerCase().includes('directed:') && lastLine.toLowerCase().includes('weighted:')) {
        
        // Parse "Directed"
        const directedMatch = lastLine.match(/Directed:\s*(true|false)/i);
        if (directedMatch) {
            setIsDirected(directedMatch[1].toLowerCase() === 'true');
        }

        // Parse "Weighted"
        const weightedMatch = lastLine.match(/Weighted:\s*(true|false)/i);
        if (weightedMatch) {
            setIsWeighted(weightedMatch[1].toLowerCase() === 'true');
        }

        // IMPORTANT: Remove this line so it isn't parsed as an edge
        lines.pop();
      }

      // 2. DETECT AND REMOVE HEADER
      // Check if first line is "Source,Target,Weight"
      if (lines.length > 0 && lines[0].toLowerCase().includes('source')) {
        lines.shift();
      }

      // 3. PARSE REMAINING LINES AS EDGES
      const parsedEdges = lines.map(line => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          const u = parts[0];
          const v = parts[1];
          const w = parts[2] || '1';
          
          // Reformat to "UVW" (Concatenated) which is safe for the input parser
          // Using concatenation helps avoid ambiguity with node names like "NodeA" vs "A"
          return `${u}${v}${w}`;
        }
        return null;
      }).filter(Boolean); // Remove nulls

      setEdgesInput(parsedEdges.join(', '));
      setGraphName(file.name.replace('.csv', ''));
    };
    
    reader.readAsText(file);
    e.target.value = ''; // Reset input to allow reloading same file
  };

  return (
    <div className="graphGenerator" id="graphGenerator">
      <h1 id="instructions">Arx Net</h1>

      <div className="sourceInput">
        <input 
          type="text" 
          placeholder="Graph name"
          value={graphName}
          onChange={(e) => setGraphName(e.target.value)}
        /> <br />
        
        <input 
          type="text" 
          placeholder="Vertices (Optional, e.g. A, B)" 
          value={verticesInput}
          onChange={(e) => setVerticesInput(e.target.value)}
        /> <br />
        
        <textarea 
          placeholder="Edges (e.g. AB5, BC3)" 
          autoComplete="off"
          spellCheck={false}
          value={edgesInput}
          onChange={(e) => setEdgesInput(e.target.value)}
          style={{ 
            width: '100%', 
            height: '60px', 
            fontFamily: 'monospace',
            marginBottom: '5px',
            background: 'none',
            border: '1.5px solid var(--accent)',
            color: 'var(--text-primary)',
            padding: '10px'
          }}
        /> <br />

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <label><input type="checkbox" checked={isDirected} onChange={(e) => setIsDirected(e.target.checked)} /> Directed</label>
          <label><input type="checkbox" checked={isWeighted} onChange={(e) => setIsWeighted(e.target.checked)} /> Weighted</label>
        </div>

        <button id="generateGraph" onClick={handleGenerateClick}>Generate Graph</button>
        
        <input 
          type="file" 
          accept=".csv,.txt" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileUpload} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          style={{ 
            width: 'calc(100% - 20px)', 
            marginTop: '5px', 
            backgroundColor: '#444', 
            border: '1px solid #666', 
            color: '#fff', 
            padding: '5px' 
          }}
        >
          Load Edge List (CSV)
        </button>
        
        <hr style={{ borderColor: '#333', margin: '15px 0' }} />

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '0.9em' }}>
            <label><input type="checkbox" checked={ensureConnected} onChange={(e) => setEnsureConnected(e.target.checked)} /> Connected</label>
            <label><input type="checkbox" checked={allowSelfLoops} onChange={(e) => setAllowSelfLoops(e.target.checked)} /> Self loops</label>
            <label><input type="checkbox" checked={allowDuplicates} onChange={(e) => setAllowDuplicates(e.target.checked)} /> Duplicates</label>
        </div>

        <p id="minMaxRec">
           Max edge count: <b style={{ color: '#ffc66d' }}> {maxRec} </b>
        </p>
        
        <button id="generateRandomGraph" onClick={handleRandomClick}>
          Generate Random Graph
        </button>
      </div>
    </div>
  );
};