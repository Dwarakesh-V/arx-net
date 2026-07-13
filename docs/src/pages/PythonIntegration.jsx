import React from 'react';
import { Copy } from 'lucide-react';

export default function PythonIntegration() {
  const codeSnippet = `import arx_net
import networkx as nx

# Parse the Arx-Net shorthand notation
adjList = arx_net.parse_edges("AB7, AA6, BA9, AC5, AD3, BC4, BE6, CD2, CF8, DE5, DG7, EE2, EF3, EH4, FG6, FI7, GH2, HI5, HJ9, IJ4")

# Convert to standard edge list type (directly supported by networkx)
edges = arx_net.convert_type(adjList, "edge")

# Initialize graph
G = nx.Graph() # or nx.DiGraph() if the graph is directed
G.add_weighted_edges_from(edges)

# Run algorithms via NetworkX
bfs_nodes = list(nx.bfs_tree(G, source="A").nodes())
print(bfs_nodes)`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    // Simple visual feedback could be added here
  };

  return (
    <div className="page-content fade-in">
      <h1>Python Integration</h1>
      
      <div className="content-box">
        <h2>NetworkX Interoperability</h2>
        <p>
          Arx-Net includes a dedicated Python package designed to bridge the gap between our rapid topology 
          prototyping frontend and the robust, industry-standard <code>networkx</code> library.
        </p>
        
        <h3>Installation</h3>
        <p>You can easily install the required packages via pip:</p>
        <pre><code>pip install arx-net networkx</code></pre>
      </div>

      <div className="content-box">
        <h2>Example Usage</h2>
        <p>
          Below is a sample program demonstrating how to parse Arx-Net shorthand notation directly into a NetworkX graph object:
        </p>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={copyCode}
            style={{ 
              position: 'absolute', 
              right: '10px', 
              top: '10px', 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer' 
            }}
            title="Copy Code"
          >
            <Copy size={18} />
          </button>
          <pre><code>{codeSnippet}</code></pre>
        </div>

        <p>
          <strong>Format Conversion:</strong> The <code>arx_net.convert_type</code> method seamlessly translates 
          between adjacency lists, edge lists, and adjacency matrices depending on your backend requirements.
        </p>
      </div>
    </div>
  );
}
