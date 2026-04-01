
import type { Product } from "./product";
import type { PageConfig } from "./page";
import type { PrintSpec } from "./print-spec";

/**
 * Document, tüm tasarımın ana state ağacını temsil eder.
 * Projedeki her şey bu tip altında toplanır.
 * Yeni mimaride sayfalar ve slotlar ayrı listelerde tutulur.
 */
export type Document = {
  id: string;
  version: number;
  product: Product;
  pages: PageConfig[];
  printSpec: PrintSpec;
};
