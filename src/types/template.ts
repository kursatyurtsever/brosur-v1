import type { GlobalLayoutSettings, PageConfig, PrintSpec, Surface } from './';

// Omit<T, K> ile bir tipin belirli alanlarını hariç tutabiliriz.
// Sayfa ve Yüzeylerin şablon tanımlarında ID ve slot gibi dinamik alanlar olmamalıdır.
type TemplatePage = Omit<PageConfig, 'slots'>;
type TemplateSurface = Omit<Surface, 'id' | 'pages'> & { pages: TemplatePage[] };

export interface Template {
  id: string;
  name: string;
  surfaces: TemplateSurface[];
  layout?: Partial<GlobalLayoutSettings>;
  printSpec?: Partial<PrintSpec>;
}
