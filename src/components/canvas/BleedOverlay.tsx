import React from 'react';
import { DEFAULT_BLEED_MM } from '@/lib/constants';
import { mmToPx } from '@/services/coordinateUtils';

const BleedOverlay = () => {
  const bleedPx = mmToPx(DEFAULT_BLEED_MM);
  const style: React.CSSProperties = {
    position: 'absolute',
    top: `-${bleedPx}px`,
    left: `-${bleedPx}px`,
    right: `-${bleedPx}px`,
    bottom: `-${bleedPx}px`,
    border: '1px dashed rgba(255, 0, 0, 0.5)',
    pointerEvents: 'none', // Prevent interaction with the overlay
  };

  return <div style={style} />;
};

export default BleedOverlay;
