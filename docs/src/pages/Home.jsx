import React from 'react';

export default function Home() {
  return (
    <div className="page-content fade-in">
      <h1>Arx-Net Documentation</h1>
      
      <div className="content-box">
        <h2>What is Arx-Net?</h2>
        <p>
          Arx-Net is a powerful, open-source graph visualization and algorithm simulation tool 
          built entirely with Vanilla JavaScript and D3.js. It allows you to create complex network topologies, 
          run classical graph algorithms, and visualize step-by-step executions in real-time.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
          <img src="/dashboard.png" alt="Dashboard Showcase" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        </div>
        
        <h3>Key Features</h3>
        <ul>
          <li><strong>Procedural Graph Generation:</strong> Quickly build massive randomized graphs or specific tree structures (BST, AVL, B+ Trees).</li>
          <li><strong>Real-Time Visualization:</strong> Watch algorithms like Dijkstra, Kruskal, and Tarjan's SCC evaluate networks visually.</li>
          <li><strong>Interactive Sandbox:</strong> Drag, pan, zoom, and apply physics-based force layouts to your topologies.</li>
          <li><strong>Python Interoperability:</strong> Seamlessly integrate with Python's <code>networkx</code> library.</li>
        </ul>
      </div>

      <div className="content-box">
        <h2>Quick Start</h2>
        <p>
          You don't need to install anything to use the web-based visualizer. Simply open the main application and start adding nodes or edges in the sidebar.
        </p>
        <p>
          If you are looking to integrate Arx-Net's parsing engine into your Python environment:
        </p>
        <pre><code>pip install arx-net networkx</code></pre>
      </div>
    </div>
  );
}
