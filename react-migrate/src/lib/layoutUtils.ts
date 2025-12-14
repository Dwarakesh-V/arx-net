// Helper to calculate position based on index (0, 1, 2...)
export const getGridPosition = (index: number, mode: 'default' | 'grid4' | 'grid9') => {
  if (mode === 'default') return null; // Let the window handle its own position

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  // Assuming Sidebar is ~250px or 20% of screen. 
  // Adjust 'startX' to account for your sidebar width
  const startX = 300; 
  
  if (mode === 'grid4') {
    const width = (viewportWidth - startX) / 2;
    const height = viewportHeight / 2;
    const row = Math.floor(index / 2);
    const col = index % 2;
    
    return {
      x: startX + (col * width),
      y: row * height,
      width: width - 10, // -10 for gap
      height: height - 10
    };
  }

  if (mode === 'grid9') {
    const width = (viewportWidth - startX) / 3;
    const height = viewportHeight / 3;
    const row = Math.floor(index / 3);
    const col = index % 3;

    return {
      x: startX + (col * width),
      y: row * height,
      width: width - 10,
      height: height - 10
    };
  }

  return null;
};

// Add this to your existing layoutUtils.ts

export const getSnapPosition = (x: number, y: number, viewMode: 'default' | 'grid4' | 'grid9') => {
    const parentWidth = window.innerWidth;
    const parentHeight = window.innerHeight;

    if (viewMode === 'grid4') {
        // Snap to 4 corners
        const snapX = (x / parentWidth) < 0.1875 ? 0 : 0.375 * parentWidth;
        const snapY = (y / parentHeight) < 0.25 ? 0 : 0.5 * parentHeight;
        return { x: snapX, y: snapY };
    }
    else if (viewMode === 'grid9') {
        const snapXValues = [0, 0.25, 0.50].map(val => val * parentWidth);
        const snapYValues = [0, 0.3333, 0.6666].map(val => val * parentHeight);

        // Find closest
        const snapX = snapXValues.reduce((prev, curr) => Math.abs(curr - x) < Math.abs(prev - x) ? curr : prev);
        const snapY = snapYValues.reduce((prev, curr) => Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev);
        return { x: snapX, y: snapY };
    }

    return { x, y }; // No snapping
};