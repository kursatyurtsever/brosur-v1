import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { getAvailableTemplates } from '@/services/templateService';
import { useSettingsStore } from './useSettingsStore';
import type { Document, PageConfig, Slot, SlotContent, Surface } from '../types';
import { getSurfaceNumber } from '../lib/surfaceUtils';
import { nanoid } from 'nanoid';

const MAX_HISTORY = 50;

// Helper function to generate slots for a specific page
const createPageSlots = (pageNumber: number): Slot[] => {
  const surfaceNumber = getSurfaceNumber(pageNumber, 2);
  return Array.from({ length: 16 }, (_, i) => {
    const gridIndex = i + 1;
    const globalIndex = ((pageNumber - 1) * 16) + gridIndex;
    return {
      id: `F${surfaceNumber}-P${pageNumber}-C${globalIndex}`,
      globalIndex,
      gridIndex,
      colSpan: 1,
      rowSpan: 1,
      hidden: false,
      mode: 'slot',
      content: null,
    };
  });
};

interface DocState {
  document: Document | null;
  history: {
    past: Document[];
    future: Document[];
  };
}

interface DocActions {
  setDocument: (doc: Document) => void;
  initDocument: () => void;
  updatePageConfig: (pageNumber: number, config: Partial<Omit<PageConfig, 'slots'>>) => void;
  updateSlotContent: (slotId: string, content: SlotContent | null) => void;
  loadTemplate: (templateId: string) => void;
  undo: () => void;
  redo: () => void;
  _snapshot: () => void;
}

export const useDocStore = create<DocState & DocActions>()(
  immer((set, get) => ({
    document: null,
    history: { past: [], future: [] },

    _snapshot: () => {
      set(state => {
        if (!state.document) return;
        state.history.future = [];
        state.history.past.push(JSON.parse(JSON.stringify(state.document)));
        if (state.history.past.length > MAX_HISTORY) {
          state.history.past.shift();
        }
      });
    },

    setDocument: (doc) => {
      set(state => {
        state.history.past = [];
        state.history.future = [];
        state.document = doc;
      });
    },

    updatePageConfig: (pageNumber, config) => {
      get()._snapshot();
      set(state => {
        if (!state.document) return;
        for (const surface of state.document.surfaces) {
          const page = surface.pages.find(p => p.pageNumber === pageNumber);
          if (page) {
            Object.assign(page, config);
            return;
          }
        }
      });
    },

    updateSlotContent: (slotId, content) => {
      get()._snapshot();
      set(state => {
        if (!state.document) return;
        for (const surface of state.document.surfaces) {
          for (const page of surface.pages) {
            const slot = page.slots.find(s => s.id === slotId);
            if (slot) {
              slot.content = content;
              return;
            }
          }
        }
      });
    },

    loadTemplate: (templateId) => {
      get()._snapshot();
      const templates = getAvailableTemplates();
      const selectedTemplate = templates.find(t => t.id === templateId);

      if (!selectedTemplate) {
        console.warn(`Template with id "${templateId}" not found.`);
        return;
      }

      set(state => {
        if (!state.document) return;

        // Create full Surface and PageConfig objects from template
        const newSurfaces: Surface[] = selectedTemplate.surfaces.map((templateSurface, index) => ({
          id: `surface-${index}-${nanoid()}`,
          name: templateSurface.name,
          pages: templateSurface.pages.map(templatePage => ({
            ...(templatePage as PageConfig),
            slots: createPageSlots(templatePage.pageNumber),
          })),
        }));

        state.document.surfaces = newSurfaces;

        if (selectedTemplate.layout) {
          useSettingsStore.getState().setLayout(selectedTemplate.layout);
        }

        if (selectedTemplate.printSpec) {
          Object.assign(state.document.printSpec, selectedTemplate.printSpec);
        }
      });
    },

    undo: () => {
      set((state) => {
        const { past, future } = state.history;
        if (past.length === 0) return;
        const previous = past.pop();
        if (state.document) {
          future.unshift(JSON.parse(JSON.stringify(state.document)));
        }
        state.document = previous ?? null;
      });
    },

    redo: () => {
      set((state) => {
        const { past, future } = state.history;
        if (future.length === 0) return;
        const next = future.shift();
        if (state.document) {
          past.push(JSON.parse(JSON.stringify(state.document)));
        }
        state.document = next ?? null;
      });
    },

    initDocument: () => {
      const initialSurface: Surface = {
        id: 'surface-0',
        pages: [
          {
            pageNumber: 1,
            widthMm: 210,
            heightMm: 297,
            safeZone: [10, 10, 10, 10],
            freeRowsTop: 0,
            slots: createPageSlots(1),
          },
        ],
      };

      const initialDoc: Document = {
        id: 'doc-1',
        version: 2,
        product: {
          id: 'prod-brosur',
          name: 'Broşür',
          width: 210,
          height: 297,
        },
        printSpec: {
          bleed: 3,
          margin: 5,
          iccProfile: 'Coated FOGRA39',
        },
        surfaces: [initialSurface],
      };

      get().setDocument(initialDoc);
    },
  }))
);
