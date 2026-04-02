
import React from 'react';
import type { PageConfig, GlobalLayoutSettings, Slot } from '@/types';
import { mmToPx } from '@/services/coordinateUtils';
import { computeGridMetrics } from '@/services/layoutEngine';
import BleedOverlay from './BleedOverlay';
import { SlotPlaceholder } from './SlotPlaceholder';

interface PageFrameProps {
  pageConfig: PageConfig;
  settings: GlobalLayoutSettings;
  cellH: number;
  isFirstInSurface: boolean;
  isLastInSurface: boolean;
}

const PageFrame: React.FC<PageFrameProps> = ({ 
  pageConfig, 
  settings, 
  cellH, 
  isFirstInSurface, 
  isLastInSurface 
}) => {
  const { slots } = pageConfig;
  
  const metrics = computeGridMetrics(pageConfig, cellH, settings);
  const { cellW, gridOriginYMm, visibleRows } = metrics;

  const widthPx = mmToPx(pageConfig.widthMm);
  const heightPx = mmToPx(pageConfig.heightMm);
  const gridOriginYPx = mmToPx(gridOriginYMm);
  const cellWPx = mmToPx(cellW);
  const cellHPx = mmToPx(cellH);
  const gapPx = mmToPx(settings.gap);

  const pageStyle: React.CSSProperties = {
    width: `${widthPx}px`,
    height: `${heightPx}px`,
    position: 'relative', // Grid container'ı konumlandırmak için gerekli
    // Dış çerçeve stilleri (arka plan, gölge) SurfaceFrame'e taşındı.
  };

  // Katlama paylarını hesaba kat
  const leftMargin = pageConfig.safeZone[3];
  const rightMargin = pageConfig.safeZone[1];

  const gridContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${mmToPx(pageConfig.safeZone[0])}`,
    left: `${mmToPx(leftMargin)}px`,
    right: `${mmToPx(rightMargin)}px`,
    bottom: `${mmToPx(pageConfig.safeZone[2] + settings.footerHeightMm)}px`,
    display: 'grid',
    gridTemplateColumns: `repeat(${settings.cols}, ${cellWPx}px)`,
    gridTemplateRows: `repeat(${visibleRows}, ${cellHPx}px)`,
    gap: `${gapPx}px`,
    // The grid is defined by its container; children will flow into it.
    // We must render a placeholder for every slot to maintain order.
  };

  // Per .clinerules, calculate displayNumber at render-time.
  const visibleSlots = slots
    .filter(s => s.mode !== 'free' && !s.hidden)
    .sort((a, b) => a.gridIndex - b.gridIndex);

  const displayNumberMap = new Map<string, number>();
  visibleSlots.forEach((slot, index) => {
    displayNumberMap.set(slot.id, index + 1);
  });

  const pageNumberStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '5px',
    right: '10px',
    fontSize: '10px',
    color: '#888',
    fontFamily: 'sans-serif',
  };

  return (
    <div style={pageStyle}>
      <div style={gridContainerStyle}>
        {slots.map(slot => (
          <SlotPlaceholder 
            key={slot.id} 
            slot={slot} 
            displayNumber={displayNumberMap.get(slot.id) || 0} 
          />
        ))}
      </div>
      <div style={pageNumberStyle}>Sayfa {pageConfig.pageNumber}</div>
    </div>
  );
};

export default PageFrame;
