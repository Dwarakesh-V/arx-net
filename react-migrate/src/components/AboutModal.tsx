import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="aboutDiv" id="aboutDiv" style={{ display: 'block' }}>
      {/* Click backdrop to close */}
      <div 
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }} 
        onClick={onClose} 
      />
      
      <span style={{ color: '#ffc66d', fontWeight: 'bold', fontSize: 'x-large' }}>
        Arx Net guide
      </span> <br />
      © 2025 arx-net
      <p>
        This section provides guidance on how to use the Arx Net application effectively...
        {/* Copy the rest of your text content here */}
      </p>

      {/* ... keeping your lists ... */}
      <span style={{ color: '#ffc66d', fontWeight: 'bold' }}>Graph Generation:</span>
      <ul>
        <li>Enter the graph name and edges in the specified format.</li>
        <li>The edges can be directed or undirected, and weighted or unweighted.</li>
        {/* ... etc ... */}
      </ul>

      <p>Click anywhere outside this window to close the guide.</p>
    </div>
  );
};