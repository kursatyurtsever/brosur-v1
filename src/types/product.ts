
/**
 * Ürün, bir tasarımın en üst seviye konteynerıdır.
 * Örneğin, "A4 Çift Kırım Broşür".
 */
export type Product = {
  id: string;
  name: string;
  width: number; // mm
  height: number; // mm
};
