import React from 'react';

// FIX: Update the type to match what App.tsx provides
interface OutlinerProps {
  onLayoutChange: (mode: 'grid4' | 'grid9') => void; // Changed from '4' | '9'
  onSnapToggle: () => void;
  onClearAll: () => void;
  onToggleVisibility: () => void;
}

export const Outliner: React.FC<OutlinerProps> = ({ 
  onLayoutChange, 
  onSnapToggle, 
  onClearAll, 
  onToggleVisibility 
}) => {
  return (
    <div className="outliner">
      <b style={{ marginRight: '20px', fontSize: 'larger' }}>Graphs</b>
      
      {/* FIX: Pass 'grid4' instead of '4' */}
      <button id="view4" title="Scale graphs to fit 4" onClick={() => onLayoutChange('grid4')}>
        <img src="/images/disable4g.png" alt="View 4" />
      </button>

      {/* FIX: Pass 'grid9' instead of '9' */}
      <button id="view9" title="Scale graphs to fit 9" onClick={() => onLayoutChange('grid9')}>
        <img src="/images/disable9g.png" alt="View 9" />
      </button>

      <button id="snap" title="Snap to increments" onClick={onSnapToggle}>
        <img src="/images/disablesnap.png" alt="Snap" />
      </button>

      <button id="showHideAll" title="Minimize/Maximize all" onClick={onToggleVisibility}>
        <img src="/images/show.png" alt="Show/Hide" />
      </button>

      <button id="clearAll" title="Delete all graphs" onClick={onClearAll}>
        <img src="/images/delete.png" alt="Delete" />
      </button>
    </div>
  );
};