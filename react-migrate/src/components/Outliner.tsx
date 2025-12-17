import React, { useState } from 'react';
import type { GraphData } from '../types';

interface OutlinerProps {
  graphs: GraphData[];
  activeGraphId: number | null;
  onLayoutChange: (mode: 'grid4' | 'grid9') => void;
  onSnapToggle: () => void;
  onClearAll: () => void;
  onToggleVisibility: () => void;
  onSelectGraph: (id: number) => void;
  onDeleteGraph: (id: number) => void;
  onRenameGraph: (id: number, newName: string) => void;
}

export const Outliner: React.FC<OutlinerProps> = ({ 
  graphs,
  activeGraphId,
  onLayoutChange, 
  onSnapToggle, 
  onClearAll, 
  onToggleVisibility,
  onSelectGraph,
  onDeleteGraph,
  onRenameGraph,
}) => {
  // State for renaming logic
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempName, setTempName] = useState('');

  const handleDoubleClick = (graph: GraphData) => {
    setEditingId(graph.id);
    setTempName(graph.name);
  };

  const handleNameSave = () => {
    if (editingId !== null && tempName.trim() !== '') {
      onRenameGraph(editingId, tempName);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleNameSave();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div className="outliner">
      {/* --- Toolbar Header --- */}
      <div className="outliner-header">
        <b style={{ marginRight: '10px', fontSize: '1.1em' }}>Graphs</b>
        
        <div className="outliner-controls">
            <button title="Grid View 4" onClick={() => onLayoutChange('grid4')}>
                <img src="/images/disable4g.png" alt="4" />
            </button>
            <button title="Grid View 9" onClick={() => onLayoutChange('grid9')}>
                <img src="/images/disable9g.png" alt="9" />
            </button>
            <button title="Snap" onClick={onSnapToggle}>
                <img src="/images/disablesnap.png" alt="Snap" />
            </button>
            <button title="Show/Hide All" onClick={onToggleVisibility}>
                <img src="/images/show.png" alt="Eye" />
            </button>
            <button title="Delete All" onClick={onClearAll}>
                <img src="/images/delete.png" alt="Del" />
            </button>
        </div>
      </div>

      <hr style={{ borderColor: '#444', margin: '10px 0' }} />

      {/* --- Scrollable List --- */}
      <div className="graph-list">
        {graphs.length === 0 && (
            <div style={{ color: '#666', fontStyle: 'italic', padding: '10px' }}>
                No graphs created.
            </div>
        )}

        {graphs.map((graph) => (
          <div 
            key={graph.id} 
            className={`list-item ${graph.id === activeGraphId ? 'active' : ''}`}
            onClick={() => onSelectGraph(graph.id)}
          >
            {editingId === graph.id ? (
              <input 
                autoFocus
                type="text" 
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleNameSave}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()} // Prevent triggering parent click
                style={{ 
                    width: '70%', 
                    background: '#222', 
                    border: '1px solid var(--accent)', 
                    color: '#fff',
                    padding: '2px 5px'
                }}
              />
            ) : (
              <span 
                className="graph-name" 
                title="Double-click to rename"
                onDoubleClick={() => handleDoubleClick(graph)}
              >
                {graph.name}
              </span>
            )}

            <div className="item-actions">
                <span style={{ fontSize: '0.8em', color: '#666', marginRight: '5px' }}>
                    {graph.nodes.length}v
                </span>
                <button 
                    className="delete-btn"
                    title="Delete Graph"
                    onClick={(e) => {
                        e.stopPropagation(); // Stop click from selecting the graph
                        onDeleteGraph(graph.id);
                    }}
                >
                    ×
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};