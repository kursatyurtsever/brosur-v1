import React, { useMemo } from 'react';
import { useUIStore } from '@/store/useUIStore';
import { useDocStore } from '@/store/useDocStore';
import { useShallow } from 'zustand/react/shallow';
import ColorPicker from '../editors/ColorPicker';
import { Slot } from '@/types';
import { hexToRgb, rgbToCmyk } from '@/lib/colorUtils';

export const SlotEditor: React.FC = () => {
  const selectedSlotId = useUIStore((state) => state.selectedSlotId);
  const { document, updateSlot } = useDocStore(
    useShallow((state) => ({ 
      document: state.document, 
      updateSlot: state.updateSlot 
    }))
  );

  const selectedSlot = useMemo(() => {
    if (!selectedSlotId || !document) return null;
    for (const page of document.pages) {
      const slot = page.slots.find((s) => s.id === selectedSlotId);
      if (slot) return slot;
    }
    return null;
  }, [document, selectedSlotId]);

  const handleColorChange = (newHex: string) => {
    if (!selectedSlot) return;
    const { r, g, b } = hexToRgb(newHex);
    updateSlot(selectedSlot.id, {
      style: {
        ...selectedSlot.style,
        background: {
          ...selectedSlot.style.background,
          value: { ...selectedSlot.style.background?.value, hex: newHex, cmyk: rgbToCmyk(r, g, b) },
          isGlobal: false,
        },
      },
    });
  };

  const handleOpacityChange = (newOpacity: number) => {
    if (!selectedSlot) return;
    updateSlot(selectedSlot.id, {
      style: {
        ...selectedSlot.style,
        background: {
          ...selectedSlot.style.background,
          value: { ...selectedSlot.style.background?.value, opacity: newOpacity },
          isGlobal: false,
        },
      },
    });
  };

  return (
    <div className="fixed top-0 right-0 h-screen w-[300px] bg-neutral-800 p-4 text-white z-50">
      <h2 className="text-lg font-bold mb-4">Slot Ayarları</h2>
      {selectedSlot ? (
        <div>
          <div>Slot ID: {selectedSlot.id}</div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Arkaplan Rengi</label>
            <ColorPicker 
              initialColor={selectedSlot.style?.background?.value?.hex || "#FFFFFF"} 
              initialOpacity={selectedSlot.style?.background?.value?.opacity ?? 1}
              onChange={handleColorChange} 
              onOpacityChange={handleOpacityChange}
            />
          </div>
        </div>
      ) : (
        <div>Seçili bir slot yok.</div>
      )}
    </div>
  );
};
