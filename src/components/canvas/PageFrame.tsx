
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
}

const PageFrame: React.FC<PageFrameProps> = ({ pageConfig, settings, cellH }) => {
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
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  };

  const gridContainerStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${gridOriginYPx}px`,
    left: `${mmToPx(pageConfig.safeZone[3])}px`,
    right: `${mmToPx(pageConfig.safeZone[1])}px`,
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

  return (
    <div style={pageStyle}>
      <BleedOverlay /> 
      <div style={gridContainerStyle}>
        {slots.map(slot => (
          <SlotPlaceholder 
            key={slot.id} 
            slot={slot} 
            displayNumber={displayNumberMap.get(slot.id) || 0} 
          />
        ))}
      </div>
    </div>
  );
};

export default PageFrame;
