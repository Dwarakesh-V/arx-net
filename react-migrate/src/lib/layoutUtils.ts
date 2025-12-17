// Define standard constraints
const SIDEBAR_WIDTH = 300;
const SNAP_SIZE = 50; // Pixels to snap to
const GAP = 15; // Gap between windows in grid mode

export const getGridPosition = (index: number, mode: 'default' | 'grid4' | 'grid9') => {
  if (mode === 'default') return null; // Let the window handle its own position

  // 1. Calculate Available Workspace
  const viewportWidth = window.innerWidth - SIDEBAR_WIDTH;
  const viewportHeight = window.innerHeight;

  // 2. Define Columns based on mode
  let cols = 1;
  let rows = 1;

  if (mode === 'grid4') {
    cols = 2;
    rows = 2;
  } else if (mode === 'grid9') {
    cols = 3;
    rows = 3;
  }

  // 3. Calculate Cell Dimensions
  const cellWidth = (viewportWidth - (GAP * (cols + 1))) / cols;
  const cellHeight = (viewportHeight - (GAP * (rows + 1))) / rows;

  // 4. Determine Grid Coordinates (Row/Col)
  // If we have more graphs than grid slots, we just keep wrapping them
  const row = Math.floor(index / cols);
  const col = index % cols;

  return {
    // Add Sidebar Width to X so it starts after the sidebar
    x: SIDEBAR_WIDTH + GAP + (col * (cellWidth + GAP)),
    y: GAP + (row * (cellHeight + GAP)),
    width: cellWidth,
    height: cellHeight
  };
};

// Simple utility to snap X/Y coordinates to a grid
export const getSnapPosition = (x: number, y: number, isEnabled: boolean) => {
    if (!isEnabled) return { x, y };

    return {
        x: Math.round(x / SNAP_SIZE) * SNAP_SIZE,
        y: Math.round(y / SNAP_SIZE) * SNAP_SIZE
    };
};