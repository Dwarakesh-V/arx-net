import React from 'react';

export default function Interactions() {
  return (
    <div className="page-content fade-in">
      <h1>UI & Interactions</h1>
      
      <div className="content-box">
        <h2>Global Controls</h2>
        <p>The top header bar provides essential global utilities for managing your workspace:</p>
        <ul>
          <li><strong>Light/Dark Mode:</strong> Switch the active theme palette.</li>
          <li><strong>Fullscreen:</strong> Expand the canvas to fill your monitor.</li>
          <li><strong>Import/Export:</strong> Upload previous JSON graphs or download your current workspace to a local file.</li>
        </ul>
      </div>

      <div className="content-box">
        <h2>The Outliner</h2>
        <p>
          The Outliner acts as your workspace manager, displaying a hierarchical list of all instantiated graphs.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
          <img src="/outlier_menu.png" alt="Outliner Menu" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
        </div>
        <ul>
          <li><strong>Double-Click:</strong> Rename a graph instance. (Names must be globally unique).</li>
          <li><strong>Focus Button:</strong> Instantly move the camera to center the target graph.</li>
          <li><strong>Right-Click Context Menu:</strong> Access actions like Delete and Duplicate. Duplicating allows you to apply new structural parameters (e.g., converting an unweighted graph into a weighted one).</li>
        </ul>
      </div>

      <div className="content-box">
        <h2>Graph Viewport</h2>
        <p>
          The central canvas is fully interactive, built natively with D3.js SVG manipulation.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1.5rem 0' }}>
          <video autoPlay loop muted playsInline style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <source src="/graph_viewport_control.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
        <ul>
          <li><strong>Left Mouse Button (LMB):</strong> Select and interact directly with vertices or edges.</li>
          <li><strong>Middle Mouse / Ctrl + LMB:</strong> Click and drag to pan the camera across the workspace.</li>
          <li><strong>Scroll Wheel:</strong> Zoom in and out of the active topology.</li>
          <li><strong>Double-Click Background:</strong> Reset camera transform and center the graph.</li>
          <li><strong>Right-Click Canvas:</strong> Summon advanced viewport configurations.</li>
        </ul>

        <h3>Force Physics Engine</h3>
        <p>
          By enabling the <strong>Force</strong> checkbox, the system applies a physics simulation to the nodes. 
          Nodes will naturally repel each other while edges act as springs, causing the graph to automatically untangle itself into an aesthetically pleasing layout.
        </p>
      </div>
    </div>
  );
}
