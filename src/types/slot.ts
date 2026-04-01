import type { Layer } from "./layer";
import type { CMYKColor } from "./color";
import type { SlotStyle } from "./styles";

// Arayüzde kullanılacak içerik özellikleri için temel tipler
interface BaseSlotContent {
  id: string;
}

// Metin içeriği ve özellikleri
export interface TextSlotContent extends BaseSlotContent {
  type: 'text';
  text: string;
  props: {
    fontSize: number;
    color: CMYKColor;
    textAlign: 'left' | 'center' | 'right';
  };
}

// Görsel içeriği (şimdilik basit)
export interface ImageSlotContent extends BaseSlotContent {
  type: 'image';
  src: string; // Resim kaynağı
  alt: string;
}

// Grafik/Vektör içeriği (şimdilik basit)
export interface GraphicSlotContent extends BaseSlotContent {
  type: 'graphic';
  svg: string; // SVG içeriği
}

// Tüm olası içerik tiplerinin birleşimi
export type SlotContent = TextSlotContent | ImageSlotContent | GraphicSlotContent;


/**
 * Slot, sayfa üzerinde içeriğin (layerların) yerleşeceği boşluklardır.
 * Grid sisteminin bir hücresi gibi düşünülebilir.
 */
export type Slot = {
  id: string;
  type: 'text' | 'image' | 'graphic'; // Slot tipi, content type ile eşleşmeli
  x: number; // Sayfa üzerindeki konumu (mm)
  y: number; // Sayfa üzerindeki konumu (mm)
  width: number; // (mm)
  height: number; // (mm)
  layers: Layer[];
  content: SlotContent; // Yapılandırılmış içerik
  style: Partial<SlotStyle>; // Slot'a özgü stiller
  // GeneratedBy: ai - Bu alan AI tarafından oluşturulan içerikler için kullanılabilir.
  generatedBy?: 'ai' | 'user';
};
