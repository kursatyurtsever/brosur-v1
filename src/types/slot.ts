
// =================================================================
// SLOT CONTENT TYPES
// =================================================================

export interface TextContent {
  type: 'text';
  text: string;
  generatedBy: null | 'ai';
  // ... other text properties
}

export interface ImageContent {
  type: 'image';
  src: string;
  generatedBy: null | 'ai';
  // ... other image properties
}

export interface ShapeContent {
  type: 'shape';
  shape: 'rect' | 'circle';
  generatedBy: null | 'ai';
  // ... other shape properties
}

export interface EmptyContent {
  type: 'empty';
  generatedBy: null | 'ai';
}

export type SlotContent = TextContent | ImageContent | ShapeContent | EmptyContent;

// =================================================================
// SLOT DEFINITION
// =================================================================

/**
 * Slot, 4x4'lük sabit grid üzerindeki bir hücreyi temsil eder.
 * Konumu x,y,w,h ile değil, gridIndex ile belirlenir.
 * Birleştirme (merge) işlemlerinde `hidden` ve `mergedInto` alanları kullanılır.
 */
export type Slot = {
  id: string; // Akıllı ID: F{surface}-P{page}-C{globalIndex}
  globalIndex: number; // Belge genelinde benzersiz index
  gridIndex: number;      // 1'den 16'ya kadar sabit. Asla değişmez.
  colSpan: number;          // Varsayılan: 1
  rowSpan: number;          // Varsayılan: 1
  hidden: boolean;        // Birleştirilip gizlenen veya free alandaki hücreler
  mode: 'slot' | 'free';
  content: SlotContent | null;
  mergedInto?: number;     // Gizlendiyse survivor'ın gridIndex'i
};
