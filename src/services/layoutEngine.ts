
import type { Page, Slot } from "../types";

/**
 * Verilen bir sayfayı ve slot listesini alır, birleştirme (merge) işlemi uygular.
 * Bu fonksiyon saf (pure) olmalıdır ve dışarıya bağımlılığı olmamalıdır.
 * @param page - Üzerinde işlem yapılacak sayfa.
 * @param slotIdsToMerge - Birleştirilecek slot'ların ID'leri.
 * @returns Yeni oluşturulmuş bir sayfa nesnesi.
 */
export const mergeSlots = (page: Page, slotIdsToMerge: string[]): Page => {
  console.log("Merging slots:", slotIdsToMerge, "on page:", page.id);
  // TODO: Gerçek birleştirme mantığı burada yazılacak.
  // 1. Slot'ları bul.
  // 2. Yeni bir kapsayıcı slot oluştur.
  // 3. Eski slot'ları kaldır, yenisini ekle.
  // 4. Yeni bir sayfa nesnesi döndür (immutability).
  return { ...page }; // Şimdilik sadece kopyasını dönüyoruz.
};

/**
 * Verilen bir sayfadaki bir slot'u ayırma (unmerge) işlemi uygular.
 * Bu fonksiyon saf (pure) olmalıdır.
 * @param page - Üzerinde işlem yapılacak sayfa.
 * @param slotIdToUnmerge - Ayrılacak slot'un ID'si.
 * @returns Yeni oluşturulmuş bir sayfa nesnesi.
 */
export const unmergeSlot = (page: Page, slotIdToUnmerge: string): Page => {
  console.log("Unmerging slot:", slotIdToUnmerge, "on page:", page.id);
  // TODO: Gerçek ayırma mantığı burada yazılacak.
  // 1. Ayrılacak slot'u bul.
  // 2. Bu slot'un altındaki orijinal slot'ları yeniden oluştur.
  // 3. Ayrılan slot'u kaldır.
  // 4. Yeni bir sayfa nesnesi döndür.
  return { ...page }; // Şimdilik sadece kopyasını dönüyoruz.
};

/**
 * Sayfa üzerinde otomatik olarak bir grid (ızgara) sistemi oluşturur.
 * @param page - Üzerinde işlem yapılacak sayfa.
 * @param rows - Satır sayısı.
 * @param cols - Sütun sayısı.
 * @param gap - Hücreler arası boşluk (mm).
 * @returns Grid slot'ları eklenmiş yeni bir sayfa nesnesi.
 */
export const calculateGrid = (page: Page, rows: number, cols: number, gap: number): Page => {
  console.log(`Calculating ${rows}x${cols} grid on page:`, page.id);
  const newSlots: Slot[] = [];
  const slotWidth = (page.width - (cols - 1) * gap) / cols;
  const slotHeight = (page.height - (rows - 1) * gap) / rows;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      newSlots.push({
        id: `grid-${row}-${col}-${Date.now()}`,
        type: 'text',
        x: col * (slotWidth + gap),
        y: row * (slotHeight + gap),
        width: slotWidth,
        height: slotHeight,
        layers: [],
        content: {
            id: `content-${row}-${col}-${Date.now()}`,
            type: 'text',
            text: '',
            props: {
                fontSize: 12,
                textAlign: 'left',
                color: { c: 0, m: 0, y: 0, k: 100 },
            },
        },
        style: {},
      });
    }
  }

  return {
    ...page,
    slots: newSlots,
  };
};
