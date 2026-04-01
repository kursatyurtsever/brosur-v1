'''# Matbaa Projesi Yol Haritası ve İlerleme Kaydı

Bu dosya, projenin yol haritasını ve tamamlanan görevlerin teknik detaylarını içerir. Her önemli adım tamamlandığında otomatik olarak güncellenir.

---

# İnşaat Yol Haritası — A1'den A6'ya

Toplam tahmini süre: ~17 gün

| Adım | Başlık                | Süre  | Ana çıktı                  |
|------|-----------------------|-------|----------------------------|
| A1   | Tip sistemi           | 2 gün | types/ klasörü             |
| A2   | Store mimarisi        | 2 gün | Zustand store'ları         |
| A3   | Canvas çekirdeği      | 3 gün | Sıfır-özellik render motoru |
| A4   | İçerik bloku sistemi  | 4 gün | Slot/hücre/metin/resim editörü |
| A5   | Layer sistemi         | 3 gün | Zemin, görsel, şekil katmanları |
| A6   | Export servisi        | 3 gün | PDF/X, CMYK, JPG/PNG       |

---

## A1: Tip Sistemi (2 gün)

Tüm projenin "dili". Sonraki her katman (store, canvas, export, YZ) bu tipleri import eder — ama bu tipler hiçbir şeyi import etmez. Sıfır bağımlılık.

### Tamamlanma Kriterleri
- `tsc --noEmit` hatasız geçiyor
- Her tipin küçük bir mock objesi yazılıp tip uyumu test edildi
- Barrel export çalışıyor

### A1 Yapılanlar:
- **Genel Mimari Kurallar**: Sıfır Bağımlılık, Strict Type Güvenliği, Milimetrik Standart.
- **Dosya Yapısı ve İçerikler (src/types/)**: `color.ts`, `print-spec.ts`, `product.ts`, `layer.ts`, `slot.ts`, `page.ts`, `document.ts`, `index.ts` (Barrel File).
- **Sabitler (src/lib/constants.ts)**: `MAX_PAGES`, `DEFAULT_BLEED_MM`, `DEFAULT_DPI`.
- **Bağlantı ve Entegrasyon**: `layoutEngine.ts` ve `useDocStore.ts` güncellendi, `npm run type-check` ile doğrulandı.

---

## A2: Store Mimarisi (2 gün)

📌 **Genel Mimari Kurallar**: Sıfır Çapraz Bağımlılık, Veri ve UI Ayrımı.

### 4 Store ve Güncel Sorumlulukları:
1.  **useDocStore**: Ana Veri ve Geçmiş Merkezi.
2.  **useUIStore**: Genel Arayüz Durumu.
3.  **useLayerStore**: Katman Arayüz Durumu (UI Only).
4.  **useSettingsStore**: Kalıcı Ayarlar.

### A2 Yapılanlar:
- **Genel Mimari Kurallar ve Kararlar**: Sıfır Çapraz Bağımlılık, Veri ve UI Ayrımı, Immutable State, Tip Güvenliği.
- **Dosya Yapısı ve İçerikler (src/store/)**: `useDocStore.ts`, `useUIStore.ts`, `useLayerStore.ts`, `useSettingsStore.ts`.

---

## A3: Canvas Çekirdeği (3 gün)

mm→px dönüşümü, bleed çizgisi, print-ready render.

### Tamamlanma Kriterleri:
- A4 sayfa doğru boyutta, bleed çizgisi görünüyor
- Slotlar eklenip canvas üzerinde konumlanabiliyor
- 24 sayfalık katalog yavaşlamadan açılıyor

### A3 Yapılanlar:
1.  **Temel Matematik ve Koordinat Motoru**: `src/services/coordinateUtils.ts`.
2.  **Görsel Katmanlar ve Render Sistemi**: `Canvas.tsx`, `PageFrame.tsx`, `BleedOverlay.tsx`.
3.  **Profesyonel Kamera ve Navigasyon**: `useCanvasTransform.ts`.
4.  **Hücre (Slot) ve Etkileşim Mekanizması**: `SlotPlaceholder.tsx`.
5.  **Teknik Optimizasyonlar ve Bug Fixes**: Zustand Performansı, Referans Güvenliği, Stres Testi.

---

## A4: İçerik Bloku Sistemi (4 gün)

Slot içine gerçek içerik: metin, resim, şekil.

### Tamamlanma Kriterleri:
- Metin yazılıp fontlanabiliyor, CMYK renk seçilebiliyor
- Resim yüklenip canvas'ta görünüyor
- 10 adım undo/redo hatasız çalışıyor
- Çoklu slot seçimi ve z-order değişimi çalışıyor

### A4 Yapılanlar (Gün 1):
- **TextBlock**: Hafif mimari, tipografi altyapısı, hizalama.
- **CMYK Renk Motoru**: Matbaa uyumu, Hex bridge, debounce.
- **State ve Sidebar**: Dinamik görünürlük, store entegrasyonu, infinite loop çözümü.
- **Stil Editörleri**: `ColorPicker.tsx` mimarisi.

---

## A5: Layer Sistemi (3 gün)

Zemin, görsel, şekil katmanları.

### Tamamlanma Kriterleri:
- 3 varsayılan katman her yeni sayfada otomatik oluşuyor
- Katman gizle/göster, kilitle canvas üzerinde anında yansıyor
- Sürükle-bırak katman sıralama çalışıyor

---

## A6: Export Servisi (3 gün)

PDF/X-1a, JPG/PNG. CMYK dönüşümü.

### Tamamlanma Kriterleri:
- Tek sayfalık broşür PDF/X-1a olarak indirilip Acrobat'ta açılıyor
- CMYK renkleri dönüştürülmüş, fontlar gömülü
- JPG/PNG export çalışıyor, DPI doğru
- 24 sayfalık katalog 30 saniye altında export ediliyor

---

# İlerleme Kayıtları

*Bu bölüm, tamamlanan her görevden sonra otomatik olarak doldurulacaktır.*

---

## {Tarih ve Saat}
*İşlemin yapıldığı zaman otomatik olarak eklenecek*

## Yapılan İşlem
*Kısa başlık*

## Teknik Detaylar
*Kullanılan algoritmalar, mimari kararlar*

## Kritik Kararlar
*Neden bu yolu seçtik?*

## Sıradaki Adım
*Yol haritasına göre bir sonraki görev*

---
'''