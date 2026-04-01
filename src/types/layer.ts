
import type { CMYKColor } from './color';

/**
 * Layer, bir slot içinde yer alan resim, metin gibi
 * görsel veya anlamsal katmanları temsil eder.
 */
export type Layer = {
  id: string;
  type: 'image' | 'text' | 'shape';
  x: number; // Slot içindeki konumu (mm)
  y: number; // Slot içindeki konumu (mm)
  width: number; // (mm)
  height: number; // (mm)
  rotation: number; // Derece
  content: string; // Resim URL'si, metin içeriği, SVG verisi vb.
  backgroundColor?: CMYKColor;
};
