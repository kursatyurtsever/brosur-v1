
"use client";

import { useDocStore } from "@/store/useDocStore";
import { useUIStore } from "@/store/useUIStore";
import { Slot } from "@/types";
import { hexToRgb } from "@/lib/colorUtils";
import { mmToPx, pxToMm } from "@/services/coordinateUtils";
import React, { useRef, PointerEvent, useState } from "react";
import { useShallow } from 'zustand/react/shallow';
import { TextBlock } from './TextBlock';

interface SlotPlaceholderProps {
  slot: Slot;
}

export const SlotPlaceholder: React.FC<SlotPlaceholderProps> = ({ slot }) => {
  const { setSelectedSlot, selectedSlotId, zoom } = useUIStore(
    useShallow((state) => ({ 
        setSelectedSlot: state.setSelectedSlot,
        selectedSlotId: state.selectedSlotId,
        zoom: state.zoom
    }))
  );
  const updateSlot = useDocStore(state => state.updateSlot);
  const scale = zoom / 100;
  const isSelected = selectedSlotId === slot.id;
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef<{ x: number; y: number; left: number; top: number; } | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !elementRef.current) return;
    e.stopPropagation();
    setSelectedSlot(slot.id);

    elementRef.current.setPointerCapture(e.pointerId);
    setIsDragging(true);

    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      left: elementRef.current.offsetLeft,
      top: elementRef.current.offsetTop,
    };
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || !elementRef.current) return;

    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    const actualDx = dx / scale;
    const actualDy = dy / scale;

    elementRef.current.style.left = `${dragStartRef.current.left + actualDx}px`;
    elementRef.current.style.top = `${dragStartRef.current.top + actualDy}px`;
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStartRef.current || !elementRef.current) return;

    elementRef.current.releasePointerCapture(e.pointerId);
    setIsDragging(false);

    const finalLeftPx = parseFloat(elementRef.current.style.left);
    const finalTopPx = parseFloat(elementRef.current.style.top);

    const newX = pxToMm(finalLeftPx);
    const newY = pxToMm(finalTopPx);

    updateSlot(slot.id, { x: newX, y: newY });
    dragStartRef.current = null;
  };

  const getBackgroundColor = () => {
    const hex = slot.style?.background?.value?.hex;
    const opacity = slot.style?.background?.value?.opacity ?? 1;

    if (!hex) return "rgba(229, 229, 229, 0.5)"; // Varsayılan renk

    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  const style: React.CSSProperties = {
    left: `${mmToPx(slot.x)}px`,
    top: `${mmToPx(slot.y)}px`,
    width: `${mmToPx(slot.width)}px`,
    height: `${mmToPx(slot.height)}px`,
    position: "absolute",
    touchAction: "none",
    backgroundColor: getBackgroundColor(),
  };

  return (
    <div
      ref={elementRef}
      id={`slot-${slot.id}`}
      style={style}
      className={`
        border-dashed border-neutral-400 border
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : ""}
        ${isDragging ? "cursor-grabbing shadow-lg" : "cursor-grab"}
      `}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDragStart={(e) => e.preventDefault()}
    >
      {slot.type === 'text' ? (
        <TextBlock slot={slot} isSelected={isSelected} />
      ) : (
        <div className="w-full h-full" />
      )}
    </div>
  );
};