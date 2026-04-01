
import React, { useRef } from 'react';
import { useDocStore } from '@/store/useDocStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useCanvasTransform } from '@/hooks/useCanvasTransform';
import { computeGlobalCellH } from '@/services/layoutEngine';
import PageFrame from './PageFrame';

const Canvas: React.FC = () => {
  const document = useDocStore(state => state.document);
  const settings = useSettingsStore(state => state.layout);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scale, pan } = useCanvasTransform(containerRef);

  if (!document) {
    // or a loading spinner
    return <div style={{backgroundColor: '#171717', width: '100%', height: '100%'}}>Loading Document...</div>;
  }

  // Calculate the single global cell height for all pages
  const cellH = computeGlobalCellH(
    document.pages,
    document.product.height,
    settings
  );

  const containerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#171717', // bg-neutral-900
    overflow: 'hidden',
    position: 'relative',
    cursor: 'grab',
  };

  const transformWrapperStyle: React.CSSProperties = {
    transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
    transformOrigin: '0 0',
  };

  const pagesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '48px',
    gap: '24px',
  };

  return (
    <div id="canvas-container" ref={containerRef} style={containerStyle}>
      <div style={transformWrapperStyle}>
        <div style={pagesContainerStyle}>
          {document.pages.map(page => (
            <PageFrame 
              key={page.pageNumber}
              pageConfig={page}
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
