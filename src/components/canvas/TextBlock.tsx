import React from 'react';
import type { Slot, TextSlotContent } from '@/types';

interface TextBlockProps {
  slot: Slot;
  isSelected: boolean;
}

export const TextBlock: React.FC<TextBlockProps> = ({ slot, isSelected }) => {
  if (slot.type !== 'text' || !slot.content || slot.content.type !== 'text') {
    return null; // or a placeholder
  }

  const textContent = slot.content as TextSlotContent;

  const style: React.CSSProperties = {
    textAlign: textContent.props.textAlign || 'left',
    fontSize: `${textContent.props.fontSize || 12}px`,
    color: '#000000', // Placeholder color
    outline: isSelected ? '1px dashed blue' : 'none',
    width: '100%',
    height: '100%',
  };

  return (
    <div
      contentEditable={false}
      style={style}
      dangerouslySetInnerHTML={{ __html: textContent.text || '' }}
    />
  );
};
