
import type { Slot } from './slot';

/**
 * Bir sayfanın yerleşim ve boyut ayarlarını tanımlar.
 * Bu bilgiler `useDocStore` içinde tutulur.
 */
export type PageConfig = {
  pageNumber: number;
  widthMm: number;
  heightMm: number;
  safeZone: [top: number, right: number, bottom: number, left: number]; // mm
  freeRowsTop: 0 | 1 | 2 | 3 | 4;
  slots: Slot[];
};
