import { useState, useCallback } from 'react';

interface Position { x: number; y: number; width: number; height: number; }

export const useWindowInteraction = (
  initialPos: Position,
  isLocked: boolean // e.g., if View4 or View9 is active, we lock movement
) => {
  const [position, setPosition] = useState(initialPos);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // --- DRAGGING LOGIC ---
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (isLocked) return;

    // Ignore drag if clicking buttons or inputs
    if ((e.target as HTMLElement).closest('button, input')) return;

    e.preventDefault();
    setIsDragging(true);

    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      setPosition(prev => ({
        ...prev,
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY
      }));
    };

    const onMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [position.x, position.y, isLocked]);

  // --- RESIZING LOGIC ---
  const handleResizeStart = useCallback((e: React.MouseEvent, corner: string) => {
    if (isLocked) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = position.width;
    const startHeight = position.height;
    const startLeft = position.x;
    const startTop = position.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (corner.includes('right')) newWidth = startWidth + deltaX;
      if (corner.includes('left')) {
        newWidth = startWidth - deltaX;
        newX = startLeft + deltaX;
      }
      if (corner.includes('bottom')) newHeight = startHeight + deltaY;
      if (corner.includes('top')) {
        newHeight = startHeight - deltaY;
        newY = startTop + deltaY;
      }

      // Min/Max constraints
      if (newWidth > 200) {
        setPosition(p => ({ ...p, width: newWidth, x: newX, height: p.height, y: p.y })); // update X only if width valid
      }
      // Note: You would likely do a single setPosition call merging all props
      setPosition({ x: newX, y: newY, width: Math.max(200, newWidth), height: Math.max(200, newHeight) });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [position, isLocked]);

  return { position, setPosition, handleDragStart, handleResizeStart, isDragging, isResizing };
};