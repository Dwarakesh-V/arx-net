import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="aboutDiv"
        id="aboutDiv"
        style={{ display: 'block' }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: 'x-large' }}>
          Arx Net guide
        </span>
        <br />
        <span style={{ fontSize: '0.8em', color: '#888' }}>© 2025 arx-net</span>

        <p>
          This section provides guidance on how to use the Arx Net application effectively. To know about how the application works, please refer to the documentation.
        </p>

        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Graph Generation:</span>
        <ul>
          <li>Enter the graph name and edges in the specified format.</li>
          <li>The edges can be directed or undirected, and weighted or unweighted.</li>
          <li>Click on 'Generate Graph' to create the graph.</li>
          <li>Alternatively, click on 'Generate random graph' to generate a random graph with the specified number of nodes and edges.</li>
        </ul>

        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Outliner controls:</span>
        <ul>
          <li>The outliner displays all the generated graphs.</li>
          <li>You can minimize, maximize, or clear all graphs using the provided buttons.</li>
          <li>The 'View 4' and 'View 9' buttons allow you to scale the graphs to fit 4 or 9 graphs in the available space, respectively.</li>
          <li>The 'Snap' button enables snapping of graph windows to increments when moving them.</li>
          <li>You can double click on the graph name to edit it, but each graph must have a unique name.</li>
          <li>Click on the 'Focus' button to focus on the graph window, which will bring it to the front and highlight it.</li>
        </ul>

        <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>Graph window controls:</span>
        <ul>
          <li>Use the Left mouse button to interact with the vertices and edges.</li>
          <li>Use the middle mouse button (or Ctrl + LMB) to pan the graph view.</li>
          <li>Use the scroll wheel (or pinch) to zoom in and out of the graph.</li>
          <li>Right clicking on the window or the graph elements will toggle a menu with options corresponding to that element.</li>
          <li>Double clicking on the window will re-center the graph based on your current view.</li>
        </ul>

        <div style={{ marginTop: '20px', borderTop: '1px solid #444', paddingTop: '10px', textAlign: 'center', color: '#aaa', fontSize: '0.9em' }}>
          Click anywhere outside this window to close the guide.
        </div>
      </div>
    </div>
  );
};