import React, { useState } from 'react';
import { useWindowInteraction } from '../hooks/useWindowInteraction';
import { GraphCanvas } from './GraphCanvas'; 
import type { Node, Edge } from '../types'; // Ensure you have this file from previous steps

interface GraphWindowProps {
  id: number;
  title: string;
  initialX: number;
  initialY: number;
  isActive: boolean;
  isLocked: boolean;
  
  // --- Data Props ---
  nodes: Node[];
  edges: Edge[];
  isDirected: boolean;
  isWeighted: boolean;

  // --- Actions ---
  onFocus: () => void;
  onClose: () => void;
}

export const GraphWindow: React.FC<GraphWindowProps> = ({ 
  title, initialX, initialY, isActive, isLocked, 
  nodes, edges, isDirected, isWeighted,
  onFocus, onClose 
}) => {
  
  // 1. Window Movement & Resizing Hook
  const { position, setPosition, handleDragStart, handleResizeStart } = useWindowInteraction(
    { x: initialX, y: initialY, width: 600, height: 450 },
    isLocked
  );

  // 2. Local State for Controls
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [preFullScreenPos, setPreFullScreenPos] = useState(position);
  
  // These control the D3 canvas directly
  const [useForce, setUseForce] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  
  // Right-click menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number; 
    y: number; 
    type: 'node'|'edge'; 
    data: any 
  } | null>(null);

  // --- Handlers ---

  const toggleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag start
    if (!isFullScreen) {
      setPreFullScreenPos(position);
      setPosition({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight });
    } else {
      setPosition(preFullScreenPos);
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleNodeContext = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, type: 'node', data: node });
  };

  const handleEdgeContext = (event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setContextMenu({ x: event.clientX, y: event.clientY, type: 'edge', data: edge });
  };

  return (
    <div 
      className={`graphContainer ${isActive ? 'active' : ''}`}
      style={{
        // Inline styles for dynamic positioning
        position: isFullScreen ? 'fixed' : 'absolute',
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
        zIndex: isActive ? 100 : 10, 
        // Note: Other styles like bg-color and border are in index.css
      }}
      onMouseDown={() => {
        onFocus();
        setContextMenu(null); // Close menu on window click
      }} 
    >
      {/* --- 1. WINDOW HEADER --- */}
      <div 
        className="window-header" 
        onMouseDown={handleDragStart}
        onDoubleClick={toggleFullScreen}
        style={{ cursor: isLocked ? 'default' : 'grab' }}
      >
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>{title}</span>
          
          {/* Controls: Checkboxes */}
          <label title="Toggle physics simulation">
            <input 
              type="checkbox" 
              checked={useForce} 
              onChange={(e) => setUseForce(e.target.checked)} 
            /> Force
          </label>

          <label title="Toggle background grid">
            <input 
              type="checkbox" 
              checked={showGrid} 
              onChange={(e) => setShowGrid(e.target.checked)} 
            /> Grid
          </label>
        </div>

        {/* Controls: Buttons */}
        <div className="window-controls" style={{ display: 'flex', gap: '5px' }}>
           <button onClick={toggleFullScreen} title="Toggle Fullscreen">
             {isFullScreen ? '↙' : '↗'}
           </button>
           <button onClick={(e) => { e.stopPropagation(); onClose(); }} title="Close">
             ✕
           </button>
        </div>
      </div>

      {/* --- 2. MAIN CONTENT (D3 Canvas) --- */}
      <div className="window-content">
         <GraphCanvas 
            nodes={nodes}
            edges={edges}
            isDirected={isDirected}
            isWeighted={isWeighted}
            useForce={useForce}
            showGrid={showGrid}
            onNodeContextMenu={handleNodeContext}
            onEdgeContextMenu={handleEdgeContext}
         />
         
         {/* --- 3. CONTEXT MENU POPUP --- */}
         {contextMenu && (
           <div 
             className="floating-menu"
             style={{ 
               top: contextMenu.y, 
               left: contextMenu.x 
             }}
             onMouseDown={(e) => e.stopPropagation()} // Prevent clicking menu from dragging window
           >
             {contextMenu.type === 'node' ? (
               <>
                 <div style={{ padding: '8px 12px', borderBottom: '1px solid #444', color: 'var(--accent)', fontSize: '0.9em', fontWeight: 'bold' }}>
                   Vertex: {contextMenu.data.id}
                 </div>
                 <button onClick={() => console.log("Delete logic needed")}>Delete Vertex</button>
                 <button onClick={() => console.log("Add edge logic needed")}>Create Edge...</button>
               </>
             ) : (
               <>
                 <div style={{ padding: '8px 12px', borderBottom: '1px solid #444', color: 'var(--accent)', fontSize: '0.9em', fontWeight: 'bold' }}>
                   Edge
                 </div>
                 <button onClick={() => console.log("Delete edge needed")}>Delete Edge</button>
                 <button onClick={() => console.log("Edit weight needed")}>Edit Weight</button>
               </>
             )}
           </div>
         )}

         {/* --- 4. RESIZE HANDLES (Only when not maximized) --- */}
         {!isFullScreen && !isLocked && (
           <>
             {/* Main Bottom-Right Handle */}
             <div 
               className="resize-handle bottom-right" 
               onMouseDown={(e) => handleResizeStart(e, 'bottom-right')}
             />
             {/* Invisible Top Handle for height only */}
             <div 
               className="resize-handle"
               style={{ top: 0, left: 0, width: '100%', height: '5px', cursor: 'ns-resize', background: 'transparent' }}
               onMouseDown={(e) => handleResizeStart(e, 'top')}
             />
           </>
         )}
      </div>
    </div>
  );
};