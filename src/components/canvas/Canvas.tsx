
import React, { useRef } from 'react';
import { useDocStore } from '@/store/useDocStore';
import { useCanvasTransform } from '@/hooks/useCanvasTransform';
import PageFrame from './PageFrame';

const Canvas: React.FC = () => {
  const pages = useDocStore(state => state.document?.pages) || [];
  const containerRef = useRef<HTMLDivElement>(null);
  const { scale, pan } = useCanvasTransform(containerRef);

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
          {pages.map(page => (
            <PageFrame key={page.id} page={page} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas;
