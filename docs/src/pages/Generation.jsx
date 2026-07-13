import React from 'react';

export default function Generation() {
  return (
    <div className="page-content fade-in">
      <h1>Graph Generation</h1>
      
      <div className="content-box">
        <h2>Syntax & Input Formats</h2>
        <p>
          Arx-Net allows you to manually input edge definitions to construct custom graphs. The parser supports multiple shorthand formats to streamline creation.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
          <img src="/edge_input_syntax.png" alt="Edge Input Syntax" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        </div>
        
        <h3>Supported Edge Formats</h3>
        <ul>
          <li><code>(A,B,5)</code> - Explicit format: Directed/Undirected edge from vertex A to B with a weight of 5.</li>
          <li><code>AB-4</code> - Compact format: Edge from A to B with a weight of -4.</li>
          <li><code>12-6</code> - Numeric format: Edge from vertex 1 to 2 with a weight of -6.</li>
          <li><code>{"{'A':['b',2], 'C': 'D'}"}</code> - Python Adjacency Dictionary: Matches standard Python graph definitions.</li>
          <li><code>[('A','B',2), ('B','C',1)]</code> - Python Edge List.</li>
        </ul>
        <p>
          <strong>Note:</strong> Edges can be defined as directed/undirected or weighted/unweighted based on the active UI checkboxes.
        </p>
      </div>

      <div className="content-box">
        <h2>Procedural Generators</h2>
        
        <h3>Random Graph Generator</h3>
        <p>
          Instead of manually defining edges, you can use the procedural generator to build massive, connected networks.
        </p>
        <ul>
          <li>Configure limits like max vertices, max edges, and weight ranges.</li>
          <li>Toggle options for <strong>Self-Loops</strong> and <strong>Duplicate Edges</strong>.</li>
          <li>Force the graph to be mathematically <strong>Connected</strong>.</li>
        </ul>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
          <img src="/tree_generation.png" alt="Tree Generation Menu" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        </div>

        <h3>Random Tree Generator</h3>
        <p>
          Arx-Net also features a robust tree generator capable of generating specific algorithmic tree structures:
        </p>
        <ul>
          <li><strong>Binary Search Trees (BST)</strong></li>
          <li><strong>AVL Trees</strong></li>
          <li><strong>Red-Black Trees</strong></li>
          <li><strong>B-Trees & B+ Trees</strong></li>
          <li><strong>2-3 & 2-3-4 Trees</strong></li>
        </ul>
      </div>
    </div>
  );
}
