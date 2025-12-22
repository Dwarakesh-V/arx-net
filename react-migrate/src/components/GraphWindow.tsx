import React, { useState, useEffect, useRef } from 'react';
import { GraphCanvas } from './GraphCanvas';
import type { Node, Edge } from '../types';
import { getSnapPosition } from '../lib/layoutUtils';

interface GraphWindowProps {
  id: number;
  title: string;

  initialX: string | number;
  initialY: string | number;
  initialWidth?: string | number;
  initialHeight?: string | number;

  isActive: boolean;
  isSnapped: boolean;
  viewMode: 'default' | 'grid4' | 'grid9';

  nodes: Node[];
  edges: Edge[];
  isDirected: boolean;
  isWeighted: boolean;

  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;

  onAddEdge: (source: string, target: string, weight: number) => void;
  onDeleteVertex: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onAddVertex: (nodeId: string, x: number, y: number) => void;
  onUpdateEdgeWeight: (edgeId: string, newWeight: number) => void;
}

export const GraphWindow: React.FC<GraphWindowProps> = ({
  title, initialX, initialY, initialWidth, initialHeight,
  isActive, isSnapped,
  nodes, edges, isDirected, isWeighted, viewMode,
  onFocus, onClose, onMinimize,
  onAddEdge, onDeleteVertex, onDeleteEdge, onAddVertex, onUpdateEdgeWeight
}) => {

  // Local State
  const [position, setPosition] = useState({
    x: initialX,
    y: initialY,
    width: initialWidth || 600,
    height: initialHeight || 450
  });

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [preFullScreenPos, setPreFullScreenPos] = useState(position);

  // State for popups
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [edgeTarget, setEdgeTarget] = useState('');
  const [edgeWeight, setEdgeWeight] = useState(1);

  const [isAddingNode, setIsAddingNode] = useState(false);
  const [newNodeId, setNewNodeId] = useState('');

  // --- NEW STATE: Edit Edge Weight ---
  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [editWeightVal, setEditWeightVal] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const [useForce, setUseForce] = useState(false);
  const [showGrid, setShowGrid] = useState(true);

  const [contextMenu, setContextMenu] = useState<{
    x: number; y: number; type: 'node' | 'edge' | 'canvas'; data: any
  } | null>(null);

  useEffect(() => {
    setPosition({
      x: initialX,
      y: initialY,
      width: initialWidth || 600,
      height: initialHeight || 450
    });
  }, [initialX, initialY, initialWidth, initialHeight]);

  // --- Handlers ---
  const handleDragStart = (e: React.MouseEvent) => {
    if (isFullScreen) return;
    e.preventDefault();
    onFocus();

    const currentX = containerRef.current?.offsetLeft || 0;
    const currentY = containerRef.current?.offsetTop || 0;
    const startMouseX = e.clientX;
    const startMouseY = e.clientY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX - startMouseX;
      const dy = moveEvent.clientY - startMouseY;

      const newX = currentX + dx;
      const newY = currentY + dy;

      const parent = (moveEvent.target as HTMLElement).closest('.main-workspace');
      const parentW = parent ? parent.clientWidth : window.innerWidth;
      const parentH = parent ? parent.clientHeight : window.innerHeight;

      const snapped = getSnapPosition(newX, newY, isSnapped, viewMode, parentW, parentH);

      setPosition(prev => ({ ...prev, x: snapped.x, y: snapped.y }));
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
    e.stopPropagation(); e.preventDefault();
    const startX = e.clientX; const startY = e.clientY;
    const startW = containerRef.current?.offsetWidth || 600;
    const startH = containerRef.current?.offsetHeight || 450;

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

  const minimizeWindow = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMinimize();
  };

  // --- SAVE ACTIONS ---
  const handleSaveEdgeList = () => {
    const header = "Source,Target,Weight\n";
    const csvContent = edges.map(e => {
      const s = typeof e.source === 'object' ? (e.source as any).id : e.source;
      const t = typeof e.target === 'object' ? (e.target as any).id : e.target;
      return `${s},${t},${e.weight || 1}`;
    }).join("\n");
    const footer = `\nDirected: ${isDirected}, Weighted: ${isWeighted}`;
    const blob = new Blob([header + csvContent + footer], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_edges.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setContextMenu(null);
  };

  const handleSavePNG = () => {
    if (!containerRef.current) return;
    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;
    const style = getComputedStyle(document.documentElement);
    const nodeColor = style.getPropertyValue('--node-color') || '#ffc66d';
    const edgeColor = style.getPropertyValue('--edge-color') || '#a3bf60';
    const labelColor = style.getPropertyValue('--node-label-color') || '#000';
    const weightColor = style.getPropertyValue('--edge-weight-color') || '#fff';
    const bgColor = style.getPropertyValue('--bg-primary') || '#1d1d1d';

    const styleBlock = `
      <style>
        svg {
          --node-color: ${nodeColor};
          --edge-color: ${edgeColor};
          --node-label-color: ${labelColor};
          --edge-weight-color: ${weightColor};
          font-family: sans-serif;
        }
      </style>
    `;
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);
    svgString = svgString.replace('>', `>${styleBlock}`);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const bbox = svg.getBoundingClientRect();
      canvas.width = bbox.width || 800;
      canvas.height = bbox.height || 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const a = document.createElement('a');
        a.download = `${title.replace(/\s+/g, '_')}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
    setContextMenu(null);
  };


  // --- CONTEXT MENU HANDLERS ---
  const handleNodeContextMenu = (e: React.MouseEvent, n: any) => {
    e.preventDefault();
    setIsAddingEdge(false);
    setIsEditingWeight(false); // Reset edge edit state
    setEdgeTarget('');
    setEdgeWeight(1);
    setContextMenu({ x: e.clientX, y: e.clientY, type: 'node', data: n });
  };

  // --- UPDATE: Initialize Edge Menu with existing weight ---
  const handleEdgeContextMenu = (e: React.MouseEvent, edge: any) => {
    e.preventDefault();
    setIsAddingEdge(false);
    setIsAddingNode(false);
    
    // Reset Edit State and Pre-fill
    setIsEditingWeight(false);
    setEditWeightVal(edge.weight || 1);

    setContextMenu({ x: e.clientX, y: e.clientY, type: 'edge', data: edge });
  };

  const handleCanvasContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAddingNode(false);
    setIsEditingWeight(false); // Reset edge edit state
    setNewNodeId('');
    setContextMenu({ x: e.clientX, y: e.clientY, type: 'canvas', data: null });
  };

  return (
    <div
      ref={containerRef}
      className={`graphContainer ${isActive ? 'active' : ''}`}
      style={{
        position: isFullScreen ? 'fixed' : 'absolute',
        left: isFullScreen ? 0 : position.x,
        top: isFullScreen ? 0 : position.y,
        width: isFullScreen ? '100vw' : position.width,
        height: isFullScreen ? '100vh' : position.height,
        zIndex: isFullScreen ? 1000 : (isActive ? 100 : 10),
        overflow: 'hidden',
        transition: 'height 0.2s, width 0.2s',
      }}
      onMouseDown={() => { onFocus(); setContextMenu(null); }}
    >
      <div
        ref={headerRef}
        className="window-header"
        onMouseDown={handleDragStart}
        onDoubleClick={toggleFullScreen}
        style={{ cursor: 'move' }}
      >
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', overflow: 'hidden' }}>
          <span style={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>{title}</span>
          <label style={{ fontSize: '0.85em', display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={useForce} onChange={(e) => setUseForce(e.target.checked)} style={{ marginRight: '4px' }} /> Force
          </label>
          <label style={{ fontSize: '0.85em', display: 'flex', alignItems: 'center' }}>
            <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} style={{ marginRight: '4px' }} /> Grid
          </label>
        </div>

        <div className="window-controls" style={{ display: 'flex', gap: '5px' }}>
          <button onClick={minimizeWindow} title="Minimize">_</button>
          <button onClick={toggleFullScreen} title="Toggle Fullscreen">
            {isFullScreen ? '↙' : '↗'}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} title="Close" className="close-btn">
            ✕
          </button>
        </div>
      </div>

      <div className="window-content" style={{ height: 'calc(100% - 40px)', position: 'relative' }}>
        <GraphCanvas
          nodes={nodes} edges={edges} isDirected={isDirected} isWeighted={isWeighted}
          useForce={useForce} showGrid={showGrid}
          onNodeContextMenu={handleNodeContextMenu}
          onEdgeContextMenu={handleEdgeContextMenu} // Use the new handler
          onCanvasContextMenu={handleCanvasContextMenu}
        />

        {/* --- CONTEXT MENU --- */}
        {contextMenu && (
          <div
            className="floating-menu"
            style={{ top: contextMenu.y, left: contextMenu.x, width: '200px' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '8px', borderBottom: '1px solid #444', fontWeight: 'bold', color: 'var(--accent)' }}>
              {contextMenu.type === 'node' ? `Node: ${contextMenu.data.id}`
                : contextMenu.type === 'edge' ? 'Edge Actions'
                  : 'Graph Actions'}
            </div>

            {/* 1. EDGE MENU (UPDATED) */}
            {contextMenu.type === 'edge' && (
              <>
                {!isEditingWeight ? (
                  // Default View: Buttons
                  <>
                    <button onClick={() => setIsEditingWeight(true)}>Edit Weight</button>
                    <button onClick={() => {
                      if (contextMenu.data.id) onDeleteEdge(contextMenu.data.id);
                      setContextMenu(null);
                    }}>
                      Delete Edge
                    </button>
                  </>
                ) : (
                  // Edit View: Input Form
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.8em', color: '#ccc' }}>New Weight:</label>
                    <input
                      autoFocus
                      type="number"
                      value={editWeightVal}
                      onChange={(e) => setEditWeightVal(Number(e.target.value))}
                      style={{ width: '100%', padding: '5px', background: '#222', border: '1px solid #555', color: '#fff' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onUpdateEdgeWeight(contextMenu.data.id, editWeightVal);
                          setContextMenu(null);
                        }
                      }}
                    />
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => {
                          onUpdateEdgeWeight(contextMenu.data.id, editWeightVal);
                          setContextMenu(null);
                        }}
                        style={{ flex: 1, background: 'var(--accent)', color: '#000', textAlign: 'center' }}
                      >
                        Save
                      </button>
                      <button onClick={() => setIsEditingWeight(false)} style={{ flex: 1, background: '#444', textAlign: 'center' }}>
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 2. NODE MENU */}
            {contextMenu.type === 'node' && (
              <>
                {!isAddingEdge ? (
                  <>
                    <button onClick={() => setIsAddingEdge(true)}>Add Edge</button>
                    <button onClick={() => {
                      onDeleteVertex(contextMenu.data.id);
                      setContextMenu(null);
                    }}>
                      Delete Vertex
                    </button>
                  </>
                ) : (
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Target Node ID"
                      value={edgeTarget}
                      onChange={(e) => setEdgeTarget(e.target.value)}
                      style={{ width: '100%', padding: '5px', background: '#222', border: '1px solid #555', color: '#fff' }}
                    />
                    <input
                      type="number"
                      placeholder="Weight"
                      value={edgeWeight}
                      onChange={(e) => setEdgeWeight(Number(e.target.value))}
                      style={{ width: '100%', padding: '5px', background: '#222', border: '1px solid #555', color: '#fff' }}
                    />
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => {
                          if (edgeTarget.trim()) {
                            onAddEdge(contextMenu.data.id, edgeTarget, edgeWeight);
                            setContextMenu(null);
                          }
                        }}
                        style={{ flex: 1, background: 'var(--accent)', color: '#000', textAlign: 'center' }}
                      >
                        Add
                      </button>
                      <button onClick={() => setIsAddingEdge(false)} style={{ flex: 1, background: '#444', textAlign: 'center' }}>
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* 3. CANVAS (BACKGROUND) MENU */}
            {contextMenu.type === 'canvas' && (
              <>
                {!isAddingNode ? (
                  <>
                    <button onClick={() => setIsAddingNode(true)}>Add Vertex</button>
                    <hr style={{ border: 'none', borderTop: '1px solid #444', margin: '4px 0' }} />
                    <button onClick={handleSavePNG}>Save as PNG</button>
                    <button onClick={handleSaveEdgeList}>Save as EdgeList</button>
                  </>
                ) : (
                  <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      autoFocus
                      type="text"
                      placeholder="New Vertex ID"
                      value={newNodeId}
                      onChange={(e) => setNewNodeId(e.target.value)}
                      style={{ width: '100%', padding: '5px', background: '#222', border: '1px solid #555', color: '#fff' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newNodeId.trim()) {
                          onAddVertex(newNodeId, Math.random() * 400, Math.random() * 300);
                          setContextMenu(null);
                        }
                      }}
                    />
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button
                        onClick={() => {
                          if (newNodeId.trim()) {
                            onAddVertex(newNodeId, Math.random() * 400, Math.random() * 300);
                            setContextMenu(null);
                          }
                        }}
                        style={{ flex: 1, background: 'var(--accent)', color: '#000', textAlign: 'center' }}
                      >
                        Add
                      </button>
                      <button onClick={() => setIsAddingNode(false)} style={{ flex: 1, background: '#444', textAlign: 'center' }}>
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!isFullScreen && (
          <div className="resize-handle bottom-right" onMouseDown={handleResizeStart} style={{ position: 'absolute', bottom: 0, right: 0, width: '15px', height: '15px', cursor: 'nwse-resize', zIndex: 20 }} />
        )}
      </div>
    </div>
  );
};