export const getGridPosition = (index: number, mode: 'default' | 'grid4' | 'grid9') => {
  if (mode === 'default') return null; 

  // 1. Define Layout Logic
  // Grid 4 = 2 columns, Grid 9 = 3 columns
  const cols = mode === 'grid4' ? 2 : 3;
  const rows = mode === 'grid4' ? 2 : 3;

  // 2. Calculate Grid Coordinates
  // (e.g., Index 2 in Grid 4 is Row 1, Col 0)
  const row = Math.floor(index / cols);
  const col = index % cols;

  // 3. Return Percentage Strings
  // We use .toFixed(2) to avoid messy floats like 33.333333%
  const widthPercent = 100 / cols;
  const heightPercent = 100 / rows;

  return {
    x: `${(col * widthPercent).toFixed(2)}%`,
    y: `${(row * heightPercent).toFixed(2)}%`,
    width: `${widthPercent.toFixed(2)}%`,
    height: `${heightPercent.toFixed(2)}%`
  };
};

// Simple utility to snap X/Y coordinates to a grid
export const getSnapPosition = (
    x: number, 
    y: number, 
    isEnabled: boolean, 
    mode: 'default' | 'grid4' | 'grid9',
    containerWidth: number,   // Pass these from the component
    containerHeight: number
) => {
    if (!isEnabled) return { x, y };

    // Default Mode: Snap to a 50px grid (Standard behavior)
    if (mode === 'default') {
        const SNAP_PX = 50;
        return {
            x: Math.round(x / SNAP_PX) * SNAP_PX,
            y: Math.round(y / SNAP_PX) * SNAP_PX
        };
    }

    // Grid Modes: Snap to the specific grid lines (Universal)
    // Grid 4 splits screen in 2 (50%), Grid 9 splits in 3 (33.33%)
    const divisions = mode === 'grid4' ? 2 : 3;
    
    const snapStepX = containerWidth / divisions;
    const snapStepY = containerHeight / divisions;

    // Snap to the nearest grid line
    return {
        x: Math.round(x / snapStepX) * snapStepX,
        y: Math.round(y / snapStepY) * snapStepY
    };
};