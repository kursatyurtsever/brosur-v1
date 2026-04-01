
import { useEffect, useRef } from 'react';
import { useUIStore } from '@/store/useUIStore';

const MIN_ZOOM = 25;
const MAX_ZOOM = 400;

export const useCanvasTransform = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const { zoom, pan, setZoom, setPan } = useUIStore();
  const isPanning = useRef(false);
  const lastPanPoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const scale = zoom / 100;

      const canvasX = (mouseX - pan.x) / scale;
      const canvasY = (mouseY - pan.y) / scale;

      const zoomFactor = 1.1;
      const newScale = e.deltaY > 0 
          ? Math.max(MIN_ZOOM / 100, scale / zoomFactor) 
          : Math.min(MAX_ZOOM / 100, scale * zoomFactor);

      const newPan = {
          x: mouseX - canvasX * newScale,
          y: mouseY - canvasY * newScale,
      };
      
      setZoom(newScale * 100);
      setPan(newPan);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1 || e.ctrlKey) { // Middle mouse button or Ctrl key
        isPanning.current = true;
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
        container.style.cursor = 'grabbing';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastPanPoint.current.x;
      const dy = e.clientY - lastPanPoint.current.y;
      const newPan = { x: pan.x + dx, y: pan.y + dy };
      setPan(newPan);
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isPanning.current = false;
      container.style.cursor = 'default';
    };
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [containerRef, pan, setPan, setZoom, zoom]);

  return { scale: zoom / 100, pan };
};
