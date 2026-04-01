
"use client";

import React from 'react';
import { useUIStore } from "@/store/useUIStore";
import type { Slot } from "@/types";
import { useShallow } from 'zustand/react/shallow';

// A temporary component to render content, will be replaced later.
const renderContent = (slot: Slot) => {
  if (!slot.content) {
    return null;
  }
  switch (slot.content.type) {
    case 'text':
      return <p>{slot.content.text}</p>;
    case 'image':
      return <img src={slot.content.src} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>;
    default:
      return null;
  }
};

interface SlotPlaceholderProps {
  slot: Slot;
  displayNumber: number;
}

export const SlotPlaceholder: React.FC<SlotPlaceholderProps> = ({ slot, displayNumber }) => {
  const { setSelectedSlotId, selectedSlotId } = useUIStore(
    useShallow((state) => ({
      setSelectedSlotId: state.setSelectedSlotId,
      selectedSlotId: state.selectedSlotId,
    }))
  );

  // Hidden slots (merged or in free-rows) are not rendered at all.
  if (slot.hidden) {
    return null;
  }

  const isSelected = selectedSlotId === slot.id;

  const style: React.CSSProperties = {
    gridColumn: `span ${slot.colSpan || 1}`,
    gridRow: `span ${slot.rowSpan || 1}`,
    position: "relative",
    overflow: "hidden", // content should not spill out
  };

  return (
    <div
      id={slot.id}
      style={style}
      className={`
        border-dashed border-neutral-400 border
        bg-neutral-100 
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}
      `}
      onClick={() => setSelectedSlotId(slot.id)}
    >
      <div className='absolute top-0 left-1 text-xs text-neutral-500'>
        {displayNumber > 0 ? displayNumber : ''}
      </div>
      <div className='w-full h-full flex items-center justify-center'>
        {renderContent(slot)}
      </div>
    </div>
  );
};
