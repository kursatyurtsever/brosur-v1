import React from 'react';
import type { Page } from '@/types/page';
import { mmToPx } from '@/services/coordinateUtils';
import BleedOverlay from './BleedOverlay';
import { SlotPlaceholder } from './SlotPlaceholder';

interface PageFrameProps {
  page: Page;
}

const PageFrame: React.FC<PageFrameProps> = ({ page }) => {
  const widthPx = mmToPx(page.width);
  const heightPx = mmToPx(page.height);

  const pageStyle: React.CSSProperties = {
    width: `${widthPx}px`,
    height: `${heightPx}px`,
    backgroundColor: 'white',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  };

  return (
    <div style={pageStyle}>
      <BleedOverlay />
      {page.slots.map(slot => (
        <SlotPlaceholder key={slot.id} slot={slot} />
      ))}
    </div>
  );
};

export default PageFrame;
