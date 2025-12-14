import type { Node } from '../types';

export const getGraphExtent = (nodes: Node[], padding = 50) => {
  // FIX: Return consistent object structure even if empty
  if (nodes.length === 0) return { x: 0, y: 0, width: 100, height: 100 };

  const xValues = nodes.map(d => d.x);
  const yValues = nodes.map(d => d.y);
  
  const minX = Math.min(...xValues) - padding;
  const maxX = Math.max(...xValues) + padding;
  const minY = Math.min(...yValues) - padding;
  const maxY = Math.max(...yValues) + padding;

  const width = maxX - minX;
  const height = maxY - minY;
  
  return { 
    x: (minX + maxX) / 2, 
    y: (minY + maxY) / 2, 
    width, 
    height 
  };
};