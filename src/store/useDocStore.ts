
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Document, PageConfig, Slot, SlotContent } from '../types';
import { getSurfaceNumber } from '../lib/surfaceUtils';

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
  // Document Level
  setDocument: (doc: Document) => void;
  initDocument: () => void;

  // Page Level
  addPage: () => void;
  updatePageConfig: (pageNumber: number, config: Partial<Omit<PageConfig, 'slots'>>) => void;
  removePage: (pageNumber: number) => void;

  // Slot Level
  updateSlotContent: (slotId: string, content: SlotContent | null) => void;
  mergeSlots: (slotIds: string[]) => void;
  unmergeSlots: (slotId: string) => void;

  // History
  undo: () => void;
  redo: () => void;
  _snapshot: () => void; // Internal action for history
}

export const useDocStore = create<DocState & DocActions>()(
  immer((set, get) => ({
    document: null,
    history: { past: [], future: [] },

    // INTERNAL: Snapshots the current state for undo/redo
    _snapshot: () => {
      set(state => {
        if (!state.document) return;
        state.history.future = []; // Clear future on new action
        state.history.past.push(JSON.parse(JSON.stringify(state.document))); // Deep copy
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
        const page = state.document.pages.find(p => p.pageNumber === pageNumber);
        if (page) {
          Object.assign(page, config);
        }
      });
    },
    
    addPage: () => {
      get()._snapshot();
      set(state => {
        if (!state.document) return;
        const newPageNumber = state.document.pages.length + 1;
        const newPageConfig: PageConfig = {
          pageNumber: newPageNumber,
          widthMm: state.document.product.width, // default to product width
          heightMm: state.document.product.height, // default to product height
          safeZone: [10, 10, 10, 10], // default safe zone
          freeRowsTop: 0,
          slots: createPageSlots(newPageNumber),
        };
        state.document.pages.push(newPageConfig);
      });
    },

    removePage: (pageNumber) => {
      get()._snapshot();
      set(state => {
        if (!state.document) return;
        state.document.pages = state.document.pages.filter(p => p.pageNumber !== pageNumber);
        // Optional: Renumber subsequent pages
        state.document.pages.forEach((page, index) => {
          page.pageNumber = index + 1;
          // TODO: Update slot IDs and globalIndexes if page numbers change. Deferring this complexity.
        });
      });
    },

    updateSlotContent: (slotId, content) => {
        get()._snapshot();
        set(state => {
            if (!state.document) return;
            for (const page of state.document.pages) {
              const slot = page.slots.find(s => s.id === slotId);
              if (slot) {
                slot.content = content;
                return; // Exit once found and updated
              }
            }
        });
    },

    mergeSlots: (slotIds) => {
        get()._snapshot();
        // TODO: Re-implement merge logic with new data structure in a later step
        console.warn('mergeSlots not implemented in new architecture yet');
    },

    unmergeSlots: (slotId) => {
        get()._snapshot();
        // TODO: Re-implement unmerge logic with new data structure in a later step
        console.warn('unmergeSlots not implemented in new architecture yet');
    },

    undo: () => {
      set((state) => {
        const { past, future } = state.history;
        if (past.length === 0) return;
        const previous = past.pop();
        if (state.document) {
          future.unshift(JSON.parse(JSON.stringify(state.document))); // Deep copy
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
          past.push(JSON.parse(JSON.stringify(state.document))); // Deep copy
        }
        state.document = next ?? null;
      });
    },

    initDocument: () => {
      const initialPages: PageConfig[] = [
        {
          pageNumber: 1,
          widthMm: 210,
          heightMm: 297,
          safeZone: [10, 10, 10, 10],
          freeRowsTop: 0,
          slots: createPageSlots(1),
        },
      ];

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
        pages: initialPages,
      };

      get().setDocument(initialDoc);
    },
  }))
);
