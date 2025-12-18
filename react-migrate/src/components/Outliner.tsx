import React, { useState } from 'react';
import type { GraphData } from '../types';

interface OutlinerProps {
  graphs: GraphData[];
  activeGraphId: number | null;
  
  // State Props
  currentLayout: 'default' | 'grid4' | 'grid9';
  isSnapping: boolean;
  areAllVisible: boolean;

  // Actions
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
  currentLayout,
  isSnapping,
  areAllVisible,
  onLayoutChange, 
  onSnapToggle, 
  onClearAll, 
  onToggleVisibility,
  onSelectGraph,
  onDeleteGraph,
  onRenameGraph,
}) => {
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
    <div className="outliner" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* --- Toolbar Header (Single Row Layout) --- */}
      <div className="outliner-header" style={{ flexShrink: 0, paddingBottom: '5px' }}>
        
        {/* Flex container to align Title (Left) and Controls (Right) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '32px' }}>
            
            {/* Left Side: Title */}
            <b style={{ fontSize: '1.1em', whiteSpace: 'nowrap' }}>Graphs</b>
            
            {/* Right Side: Buttons */}
            <div className="outliner-controls" style={{ display: 'flex', gap: '5px' }}>
                <button 
                    title={currentLayout === 'grid4' ? "Disable Grid 4" : "Enable Grid 4"} 
                    onClick={() => onLayoutChange('grid4')}
                    className={currentLayout === 'grid4' ? 'active' : ''}
                >
                    <img src={currentLayout === 'grid4' ? "/images/enable4g.png" : "/images/disable4g.png"} alt="4" />
                </button>

                <button 
                    title={currentLayout === 'grid9' ? "Disable Grid 9" : "Enable Grid 9"} 
                    onClick={() => onLayoutChange('grid9')}
                    className={currentLayout === 'grid9' ? 'active' : ''}
                >
                    <img src={currentLayout === 'grid9' ? "/images/enable9g.png" : "/images/disable9g.png"} alt="9" />
                </button>

                <button 
                    title={isSnapping ? "Disable Snap" : "Enable Snap"} 
                    onClick={onSnapToggle}
                    className={isSnapping ? 'active' : ''}
                >
                    <img src={isSnapping ? "/images/enablesnap.png" : "/images/disablesnap.png"} alt="Snap" />
                </button>

                <button 
                    title={areAllVisible ? "Hide All" : "Show All"} 
                    onClick={onToggleVisibility}
                >
                    <img src={areAllVisible ? "/images/show.png" : "/images/hide.png"} alt="Eye" />
                </button>

                <button title="Delete All" onClick={onClearAll}>
                    <img src="/images/delete.png" alt="Del" />
                </button>
            </div>
        </div>
        
        <hr style={{ borderColor: '#444', margin: '5px 0 0 0' }} />
      </div>

      {/* --- Scrollable List --- */}
      <div className="graph-list" style={{ flexGrow: 1, overflowY: 'auto', paddingTop: '10px' }}>
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
                onClick={(e) => e.stopPropagation()}
                style={{ width: '70%', background: '#222', border: '1px solid var(--accent)', color: '#fff', padding: '2px 5px' }}
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
                <span style={{ fontSize: '0.8em', color: '#666', marginRight: '5px' }}>{graph.nodes.length}v</span>
                <button 
                    className="delete-btn"
                    title="Delete Graph"
                    onClick={(e) => { e.stopPropagation(); onDeleteGraph(graph.id); }}
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