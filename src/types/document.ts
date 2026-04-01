
import type { Product } from "./product";
import type { Page } from "./page";
import type { PrintSpec } from "./print-spec";
import type { ColorData, TypographyData, SpacingData } from "./styles";

/**
 * Document, tüm tasarımın ana state ağacını temsil eder.
 * Projedeki her şey bu tip altında toplanır.
 */

export type GlobalStyles = {
  color: ColorData;
  typography: TypographyData;
  spacing: SpacingData;
  // Diğer global stiller buraya eklenebilir (typography, spacing etc.)
}

export type Document = {
  id: string;
  version: number;
  product: Product;
  pages: Page[];
  printSpec: PrintSpec;
  globalStyles: GlobalStyles;
};
