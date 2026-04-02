import React from 'react';
import type { Surface, GlobalLayoutSettings } from '@/types';
import PageFrame from './PageFrame';
import { mmToPx } from '@/services/coordinateUtils';
import BleedOverlay from './BleedOverlay';

interface SurfaceFrameProps {
  surface: Surface;
  settings: GlobalLayoutSettings;
  cellH: number;
}

const SurfaceFrame: React.FC<SurfaceFrameProps> = ({ surface, settings, cellH }) => {
  const totalWidthMm = surface.pages.reduce((acc, page) => acc + page.widthMm, 0);
  const maxHeightMm = Math.max(...surface.pages.map(p => p.heightMm));

  const surfaceContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    width: `${mmToPx(totalWidthMm)}px`,
    height: `${mmToPx(maxHeightMm)}px`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'relative', // For positioning fold lines
    backgroundColor: 'white',
  };

  let accumulatedWidth = 0;

  return (
    <div style={surfaceContainerStyle}>
      <BleedOverlay />
      {surface.pages.map((page, index) => {
        const currentPageWidth = page.widthMm;
        accumulatedWidth += currentPageWidth;

        return (
          <React.Fragment key={page.pageNumber}>
            <PageFrame
              pageConfig={page}
              settings={settings}
              cellH={cellH}
              isFirstInSurface={index === 0}
              isLastInSurface={index === surface.pages.length - 1}
            />
            {/* Render fold line after each page except the last one */}
            {index < surface.pages.length - 1 && (
              <div style={{
                position: 'absolute',
                left: `${mmToPx(accumulatedWidth)}px`,
                top: 0,
                bottom: 0,
                width: '1px',
                borderLeft: '1px dashed #888',
              }}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SurfaceFrame;
