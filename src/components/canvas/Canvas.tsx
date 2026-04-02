import React, { useRef, useEffect, useCallback } from 'react';
import { useDocStore } from '@/store/useDocStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCanvasTransform } from '@/hooks/useCanvasTransform';
import { computeGlobalCellH } from '@/services/layoutEngine';
import SurfaceFrame from './SurfaceFrame'; // YENİ
import { useUIStore } from '@/store/useUIStore';
import { mmToPx } from '@/lib/unitUtils';
import { debounce } from '@/lib/debounce';

const Canvas: React.FC = () => {
  const document = useDocStore(state => state.document);
  const settings = useSettingsStore(state => state.layout);
  const fitViewToSurface = useUIStore(state => state.fitViewToSurface);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scale, pan } = useCanvasTransform(containerRef);

  const fitToView = useCallback(() => {
    if (document && document.surfaces.length > 0 && containerRef.current) {
      // Find the surface containing pages 1, 5, and 6
      const targetPageNumbers = [1, 5, 6];
      const targetSurface = document.surfaces.find(s => 
        targetPageNumbers.every(pn => s.pages.some(p => p.pageNumber === pn))
      );

      const surfaceToFit = targetSurface || document.surfaces[0];

      const viewport = containerRef.current.getBoundingClientRect();

      const surfaceWidthMm = surfaceToFit.pages.reduce((totalWidth, page) => totalWidth + page.widthMm, 0);
      const surfaceHeightMm = Math.max(...surfaceToFit.pages.map(p => p.heightMm));

      const surfaceWidthPx = mmToPx(surfaceWidthMm);
      const surfaceHeightPx = mmToPx(surfaceHeightMm);

      fitViewToSurface(
        { width: surfaceWidthPx, height: surfaceHeightPx },
        { width: viewport.width, height: viewport.height },
        { padding: 0.9, offset: 48 } // A little more padding
      );
    }
  }, [document, fitViewToSurface]);

  useEffect(() => {
    fitToView(); // Initial fit

    const debouncedFitToView = debounce(fitToView, 100);
    window.addEventListener('resize', debouncedFitToView);

    return () => {
      window.removeEventListener('resize', debouncedFitToView);
    };
  }, [fitToView, document?.surfaces]); // Depend on fitToView and surfaces

  if (!document) {
    return <div style={{ backgroundColor: '#171717', width: '100%', height: '100%' }}>Loading Document...</div>;
  }

  // Yeni veri modeline göre tüm sayfaları tek bir dizide topla
  const allPages = document.surfaces.flatMap(s => s.pages);

  const cellH = computeGlobalCellH(
    allPages,
    document.product.height,
    settings
  );

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#171717',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'grab',
  };

  const transformWrapperStyle: React.CSSProperties = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
    transformOrigin: '0 0',
  };

  const surfacesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px',
    gap: '48px',
  };

  return (
    <div id="canvas-container" ref={containerRef} style={containerStyle}>
      <div style={transformWrapperStyle}>
        <div style={surfacesContainerStyle}>
          {document.surfaces.map(surface => (
            <SurfaceFrame
              key={surface.id}
              surface={surface}
              settings={settings}
              cellH={cellH}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
