
/**
 * Sayfa numarasına ve bir yüzeydeki sayfa sayısına göre yüzey numarasını hesaplar.
 * @param pageNumber - Hesaplamanın yapılacağı sayfa numarası (1 tabanlı).
 * @param pagesPerSurface - Bir yüzeyde kaç sayfa olduğu (varsayılan: 2).
 * @returns Yüzey numarası (1 tabanlı).
 */
export const getSurfaceNumber = (pageNumber: number, pagesPerSurface: number = 2): number => {
  if (pageNumber < 1) return 1; // Geçersiz sayfa numaraları için koruma
  return Math.ceil(pageNumber / pagesPerSurface);
};
