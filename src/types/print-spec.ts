
/**
 * Baskı payı (taşma) ve kesim çizgileri gibi
 * teknik baskı özelliklerini tanımlar.
 */
export type PrintSpec = {
  bleed: number; // Kros payı (mm)
  margin: number; // Güvenli alan (mm)
  iccProfile: string; // Renk profili (örn: "Coated FOGRA39")
};
