
import type { Slot } from "./slot";

/**
 * Page, bir dokümanın ön veya arka yüzü gibi bir sayfasını temsil eder.
 * Her sayfa kendi slot koleksiyonunu içerir.
 */
export type Page = {
  id: string;
  label: string; // örn: "Ön Yüz", "Arka Yüz", "İç Sayfa 1"
  width: number; // (mm)
  height: number; // (mm)
  slots: Slot[];
};
