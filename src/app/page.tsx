
'use client';
import { useEffect } from 'react';
import Canvas from '@/components/canvas/Canvas';
import { SlotEditor } from '@/components/editor/SlotEditor'; 
import { useDocStore } from '@/store/useDocStore';
import { useUIStore } from '@/store/useUIStore';
import { TemplatePanel } from '@/components/sidebar/TemplatePanel';


export default function HomePage() {
  const initDocument = useDocStore((state) => state.initDocument);
  const isRightSidebarOpen = useUIStore((state) => state.isRightSidebarOpen);


  useEffect(() => {
    initDocument();
  }, [initDocument]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <TemplatePanel />
      {/* Ana İçerik: Canvas */}
      <main className="grow relative">
        <Canvas />
      </main>

      {isRightSidebarOpen && <SlotEditor />}
    </div>
  );
}
