
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { Document, Page, Layer, Slot, SlotContent, TextSlotContent, ImageSlotContent } from '../types';

const MAX_HISTORY = 50;

interface DocState {
  document: Document | null;
  history: {
    past: Document[];
    future: Document[];
  };
}

interface DocActions {
  setDocument: (doc: Document) => void;
  updatePage: (pageId: string, pageData: Partial<Page>) => void;
  addPage: (page: Page) => void;
  removePage: (pageId: string) => void;
  addLayerToPage: (pageId: string, slotId: string, layer: Layer) => void;
  updateLayer: (pageId: string, slotId: string, layerId: string, layerData: Partial<Layer>) => void;
  reorderLayers: (pageId: string, slotId: string, layerIds: string[]) => void;
  undo: () => void;
  redo: () => void;
  initDocument: () => void;
  updateSlot: (slotId: string, slotData: Partial<Slot>) => void;

}

export const useDocStore = create<DocState & DocActions>()(
  immer((set) => ({
    document: null,
    history: { past: [], future: [] },

    setDocument: (doc) => {
        set((state) => {
          state.history.past = [];
          state.history.future = [];
          state.document = doc;
        });
      },
  
      updatePage: (pageId, pageData) => {
        set((state) => {
          if (!state.document) return;
          const page = state.document.pages.find((p) => p.id === pageId);
          if (page) {
            Object.assign(page, pageData);
          }
        });
      },
  
      addPage: (page) => {
          set((state) => {
              if (!state.document) return;
              state.document.pages.push(page);
          });
      },
  
      removePage: (pageId) => {
          set((state) => {
              if (!state.document) return;
              state.document.pages = state.document.pages.filter((p) => p.id !== pageId);
          });
      },
  
      addLayerToPage: (pageId, slotId, layer) => {
          set((state) => {
              if (!state.document) return;
              const page = state.document.pages.find((p) => p.id === pageId);
              const slot = page?.slots.find((s) => s.id === slotId);
              if (slot) {
                  slot.layers.push(layer);
              }
          });
      },
  
      updateLayer: (pageId, slotId, layerId, layerData) => {
          set((state) => {
              if (!state.document) return;
              const page = state.document.pages.find((p) => p.id === pageId);
              const slot = page?.slots.find((s) => s.id === slotId);
              const layer = slot?.layers.find((l) => l.id === layerId);
              if (layer) {
                  Object.assign(layer, layerData);
              }
          });
      },
  
      reorderLayers: (pageId, slotId, layerIds) => {
          set((state) => {
              if (!state.document) return;
              const page = state.document.pages.find((p) => p.id === pageId);
              const slot = page?.slots.find((s) => s.id === slotId);
              if (slot) {
                  slot.layers.sort((a, b) => layerIds.indexOf(a.id) - layerIds.indexOf(b.id));
              }
          });
      },
  
      undo: () => {
          set((state) => {
              const { past, future } = state.history;
              if (past.length === 0) return;
              const previous = past[past.length - 1];
              const newPast = past.slice(0, past.length - 1);
              if(state.document) {
                  future.unshift(state.document);
              }
              state.document = previous;
              state.history.past = newPast;
          });
      },
  
      redo: () => {
          set((state) => {
              const { past, future } = state.history;
              if (future.length === 0) return;
              const next = future[0];
              const newFuture = future.slice(1);
              if(state.document) {
                  past.push(state.document);
                  if (past.length > MAX_HISTORY) {
                      past.shift();
                  }
              }
              state.document = next;
              state.history.future = newFuture;
          });
      },
      
      updateSlot: (slotId, slotData) => {
        set((state) => {
          if (!state.document) return;
          for (const page of state.document.pages) {
            const slot = page.slots.find((s) => s.id === slotId);
            if (slot) {
              // Immer ile derin birleştirme (deep merge) yapmak için
              // Object.assign yerine property mapping daha güvenli.
              if (slotData.style) {
                slot.style = { ...slot.style, ...slotData.style };
              }
              if (slotData.content) {
                 slot.content = { ...slot.content, ...slotData.content };
              }
              // Diğer birinci seviye propertyler
              if (slotData.x) slot.x = slotData.x;
              if (slotData.y) slot.y = slotData.y;
              if (slotData.width) slot.width = slotData.width;
              if (slotData.height) slot.height = slotData.height;
              break;
            }
          }
        });
      },
  

  
      initDocument: () => {
        const pages: Page[] = Array.from({ length: 2 }, (_, i) => ({
          id: `page-${i + 1}`,
          label: `Sayfa ${i + 1}`,
          width: 210,
          height: 297,
          slots: Array.from({ length: 2 }, (_, j) => {
              const slotId = `slot-${i + 1}-${j + 1}`;
              const type = j === 0 ? 'text' : 'image';
              let content: SlotContent;
  
              if (type === 'text') {
                  content = {
                      id: `${slotId}-content`,
                      type: 'text',
                      text: 'Bu bir metin kutusudur',
                      props: {
                          fontSize: 12,
                          textAlign: 'left',
                          color: { c: 0, m: 0, y: 0, k: 100 },
                      }
                  } as TextSlotContent;
              } else {
                  content = {
                      id: `${slotId}-content`,
                      type: 'image',
                      src: '',
                      alt: 'Görsel alanı'
                  } as ImageSlotContent;
              }
  
              return {
                  id: slotId,
                  type: type,
                  content: content,
                  x: 20 + j * 100,
                  y: 20,
                  width: 80,
                  height: 50,
                  layers: [],
                  style: {},
                };
          }),
        }));
  
        const initialDoc: Document = {
          id: 'doc-1',
          version: 1,
          product: {
            id: 'prod-katalog',
            name: 'Katalog',
            width: 210,
            height: 297,
          },
          printSpec: {
              bleed: 3,
              margin: 5,
              iccProfile: 'Coated FOGRA39',
          },
          globalStyles: {
            color: {
              hex: '#000000',
              cmyk: { c: 0, m: 0, y: 0, k: 100 },
              opacity: 100,
            },
            typography: {
                fontFamily: 'Arial',
                fontSize: 12,
                fontWeight: 400,
                lineHeight: 1.5,
                letterSpacing: 0,
            },
            spacing: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
            }
          },
          pages,
        };
        set({ document: initialDoc, history: { past: [], future: [] } });
      },
  
    }))
  );
