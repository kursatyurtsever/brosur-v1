import type { PageConfig } from './page';

/**
 * Bir veya daha fazla sayfayı bir arada gruplayan render yüzeyi.
 * Örneğin bir broşürün ön yüzü veya arka yüzü.
 */
export interface Surface {
  id: string;
  name?: string; // "Ön Yüz", "İç Yüz" gibi
  pages: PageConfig[];
}
