import { useState, useEffect } from 'react';

export const useThemeColors = () => {
  const [colors, setColors] = useState({
    edgeColor: '#000',
    nodeColor: '#fff',
    // ... defaults
  });

  useEffect(() => {
    // This runs once when the app loads, safe to access 'document' here
    const style = getComputedStyle(document.documentElement);
    setColors({
      edgeColor: style.getPropertyValue('--edge-color').trim(),
      nodeColor: style.getPropertyValue('--node-color').trim(),
      // ... map the rest of your colors here
    });
  }, []);

  return colors;
};