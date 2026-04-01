
import type { PageConfig, GlobalLayoutSettings } from '../types';

/**
 * Sayfaya özel hesaplanmış grid metriklerini tanımlar.
 */
export interface GridMetrics {
  freeAreaHeightMm: number;
  gridOriginYMm: number;
  cellW: number;
  cellH: number;
  visibleRows: number;
}

/**
 * Tüm sayfalardaki en kısıtlı güvenli alanı (safeZone) bularak, 
 * tüm proje için geçerli olacak TEK bir ortak hücre yüksekliği (cellH) hesaplar.
 * Bu, farklı sayfalardaki gridlerin dikeyde birbiriyle hizalı olmasını garanti eder.
 * @param pages - Dökümandaki tüm sayfaların PageConfig dizisi.
 * @param pageHeightMm - Tüm sayfalar için standart kabul edilen yükseklik (genellikle ürün yüksekliği).
 * @param settings - Global yerleşim ayarları (gap, rows, footerHeightMm).
 * @returns Tüm grid için geçerli olan, milimetre cinsinden tek bir hücre yüksekliği.
 */
export const computeGlobalCellH = (
  pages: PageConfig[],
  pageHeightMm: number,
  settings: GlobalLayoutSettings
): number => {

  const allAvailableGridHeights = pages.map(page => {
    const safeH = pageHeightMm - page.safeZone[0] - page.safeZone[2];
    return safeH - settings.footerHeightMm;
  });

  const minGridH = Math.min(...allAvailableGridHeights);

  const totalGap = settings.gap * (settings.rows - 1);
  const cellH = (minGridH - totalGap) / settings.rows;

  return cellH;
};


/**
 * Belirli bir sayfa ve hesaplanmış global `cellH` için, o sayfaya özel grid metriklerini hesaplar.
 * @param page - Metrikleri hesaplanacak sayfanın PageConfig objesi.
 * @param cellH - `computeGlobalCellH` ile hesaplanmış global hücre yüksekliği.
 * @param settings - Global yerleşim ayarları (gap, cols).
 * @returns Sayfaya özel `GridMetrics` objesi.
 */
export const computeGridMetrics = (
  page: PageConfig,
  cellH: number,
  settings: GlobalLayoutSettings
): GridMetrics => {

  const safeW = page.widthMm - page.safeZone[3] - page.safeZone[1];
  const cellW = (safeW - settings.gap * (settings.cols - 1)) / settings.cols;

  const freeAreaHeightMm = page.freeRowsTop * cellH;
  const gridOriginYMm = page.safeZone[0] + freeAreaHeightMm;
  const visibleRows = settings.rows - page.freeRowsTop;

  return {
    freeAreaHeightMm,
    gridOriginYMm,
    cellW,
    cellH,
    visibleRows,
  };
};
