
/**
 * Projenin tamamını etkileyen global yerleşim ayarlarını tanımlar.
 * Bu ayarlar `useSettingsStore` içinde tutulur ve localStorage'a kaydedilir.
 */
export type GlobalLayoutSettings = {
  gap: number;           // mm cinsinden hücreler arası boşluk
  footerHeightMm: number;
  rows: 4;               // Sabit. Değiştirilemez.
  cols: 4;               // Sabit. Değiştirilemez.
};
