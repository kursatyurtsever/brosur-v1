
import type { PrintSpec } from "./print-spec";
import type { Product } from "./product";
import type { Surface } from "./surface";

/**
 * Uygulamadaki ana veri yapısı.
 * Tüm belgeyi, yüzeyleri, sayfaları ve ayarları içerir.
 */
export type Document = {
  id: string;
  version: number;
  product: Product;
  printSpec: PrintSpec;
  surfaces: Surface[];
};
