
'use client';
import { useEffect } from 'react';
import Canvas from '@/components/canvas/Canvas';
import { SlotEditor } from '@/components/editor/SlotEditor';
import { useDocStore } from '@/store/useDocStore';
import { useUIStore } from '@/store/useUIStore';


export default function HomePage() {
  const initDocument = useDocStore(state => state.initDocument);
  const selectedSlotId = useUIStore((state) => state.selectedSlotId);

  useEffect(() => {
    initDocument();
  }, [initDocument]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <main style={{ flexGrow: 1 }}>
        <Canvas />
      </main>

      {selectedSlotId && <SlotEditor />}
    </div>
  );
}
