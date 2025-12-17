import React, { useState, useEffect, useRef } from 'react';
import { GraphCanvas } from './GraphCanvas'; 
import type { Node, Edge } from '../types'; 
import { getSnapPosition } from '../lib/layoutUtils';

interface GraphWindowProps {
  id: number;
  title: string;
  initialX: number;
  initialY: number;
  initialWidth?: number;
  initialHeight?: number;
  
  isActive: boolean;
  isLocked: boolean;
  isSnapped: boolean;
  
  // --- Data Props ---
  nodes: Node[];
  edges: Edge[];
  isDirected: boolean;
  isWeighted: boolean;

  // --- Actions ---
  onFocus: () => void;
  onClose: () => void;
  // onMinimize is removed since we deleted the button
}

export const GraphWindow: React.FC<GraphWindowProps> = ({ 
  title, initialX, initialY, initialWidth, initialHeight,
  isActive, isLocked, isSnapped,
  nodes, edges, isDirected, isWeighted,
  onFocus, onClose 
}) => {
  
  // 1. Local State for Position & Size
  const [position, setPosition] = useState({ 
    x: initialX, 
    y: initialY, 
    width: initialWidth || 600, 
    height: initialHeight || 450 
  });

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [preFullScreenPos, setPreFullScreenPos] = useState(position);
  
  // Canvas Controls
  const [useForce, setUseForce] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  
  // Right-click menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number; 
    y: number; 
    type: 'node'|'edge'; 
    data: any 
  } | null>(null);

  // Sync position when Parent Layout changes
  useEffect(() => {
    if (isLocked) {
      setPosition({
        x: initialX,
        y: initialY,
        width: initialWidth || 600,
        height: initialHeight || 450
      });
    }
  }, [initialX, initialY, initialWidth, initialHeight, isLocked]);

  // --- Handlers ---
  const headerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    if (isLocked || isFullScreen) return;
    e.preventDefault();
    onFocus();

    const startMouseX = e.clientX;
    const startMouseY = e.clientY;
    const startX = position.x;
    const startY = position.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startMouseX;
      const dy = moveEvent.clientY - startMouseY;
      
      let newX = startX + dx;
      let newY = startY + dy;

      const snapped = getSnapPosition(newX, newY, isSnapped);

      setPosition(prev => ({ 
        ...prev, 
        x: snapped.x, 
        y: snapped.y 
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const toggleFullScreen = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!isFullScreen) {
      setPreFullScreenPos(position);
    } 
    setIsFullScreen(!isFullScreen);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startW = position.width;
      const startH = position.height;

      const handleMouseMove = (moveEvent: MouseEvent) => {
          setPosition(prev => ({
              ...prev,
              width: Math.max(300, startW + (moveEvent.clientX - startX)),
              height: Math.max(200, startH + (moveEvent.clientY - startY))
          }));
      };

      const handleMouseUp = () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div 
      className={`graphContainer ${isActive ? 'active' : ''}`}
      style={{
        position: isFullScreen ? 'fixed' : 'absolute',
        left: isFullScreen ? 0 : position.x,
        top: isFullScreen ? 0 : position.y,
        width: isFullScreen ? '100vw' : position.width,
        // Removed logic for minimized height
        height: isFullScreen ? '100vh' : position.height,
        
        zIndex: isFullScreen ? 1000 : (isActive ? 100 : 10), 
        overflow: 'hidden',
        transition: isLocked ? 'all 0.3s ease' : 'height 0.2s',
      }}
      onMouseDown={() => {
        onFocus();
        setContextMenu(null); 
      }} 
    >
      {/* --- WINDOW HEADER --- */}
      <div 
        ref={headerRef}
        className="window-header" 
        onMouseDown={handleDragStart}
        onDoubleClick={toggleFullScreen}
        style={{ cursor: isLocked ? 'default' : 'move' }}
      >
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', overflow: 'hidden' }}>
          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{title}</span>
          
          <label title="Toggle physics" style={{ fontSize: '0.85em', display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" checked={useForce} onChange={(e) => setUseForce(e.target.checked)} style={{ marginRight: '4px' }}/> 
              Force
          </label>
          <label title="Toggle grid" style={{ fontSize: '0.85em', display: 'flex', alignItems: 'center' }}>
              <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} style={{ marginRight: '4px' }}/> 
              Grid
          </label>
        </div>

        <div className="window-controls" style={{ display: 'flex', gap: '5px' }}>
           <button onClick={toggleFullScreen} title="Toggle Fullscreen">
             {isFullScreen ? '↙' : '↗'}
           </button>
           
           <button onClick={(e) => { e.stopPropagation(); onClose(); }} title="Close" className="close-btn">
             ✕
           </button>
        </div>
      </div>

      {/* --- WINDOW CONTENT --- */}
      <div className="window-content" style={{ height: 'calc(100% - 40px)', position: 'relative' }}>
        <GraphCanvas 
            nodes={nodes}
            edges={edges}
            isDirected={isDirected}
            isWeighted={isWeighted}
            useForce={useForce}
            showGrid={showGrid}
            onNodeContextMenu={(e, n) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY, type: 'node', data: n });
            }}
            onEdgeContextMenu={(e, edge) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY, type: 'edge', data: edge });
            }}
        />
        
        {/* Context Menu */}
        {contextMenu && (
        <div 
            className="floating-menu"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            <div style={{ padding: '8px', borderBottom: '1px solid #444', fontWeight: 'bold', color: 'var(--accent)' }}>
                {contextMenu.type === 'node' ? `Node: ${contextMenu.data.id}` : 'Edge'}
            </div>
            <button onClick={() => alert("Delete logic coming soon")}>Delete</button>
        </div>
        )}

        {/* Resize Handle (Bottom Right) */}
        {!isFullScreen && !isLocked && (
        <div 
            className="resize-handle bottom-right" 
            onMouseDown={handleResizeStart}
            style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '15px',
                height: '15px',
                cursor: 'nwse-resize',
                zIndex: 20
            }}
        />
        )}
      </div>
    </div>
  );
};