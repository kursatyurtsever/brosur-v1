
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  selectedSlotId: string | null; // Should be the unique slot.id

  zoom: number;
  pan: { x: number; y: number };
  isModalOpen: boolean;
  isRightSidebarOpen: boolean;
}

interface UIActions {
  setSelectedSlotId: (slotId: string | null) => void;
  toggleRightSidebar: () => void;

  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  fitViewToSurface: (surface: { width: number; height: number }, viewport: { width: number; height: number }, options?: { padding?: number; offset?: number }) => void;
  toggleModal: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  immer((set) => ({
    selectedSlotId: null,

    zoom: 100,
    pan: { x: 0, y: 0 },
    isModalOpen: false,
    isRightSidebarOpen: true,

    setSelectedSlotId: (slotId) =>
      set((state) => {
        state.selectedSlotId = slotId;
      }),


    setZoom: (zoom) =>
      set((state) => {
        state.zoom = zoom;
      }),

    setPan: (pan) =>
      set((state) => {
        state.pan = pan;
      }),

    fitViewToSurface: (surface, viewport, options) => {
        const { padding = 0.95, offset = 48 } = options || {};

        if (surface.width === 0 || surface.height === 0 || viewport.width === 0 || viewport.height === 0) {
            return;
        }

        // Consider the total canvas content size including offsets
        const contentWidth = surface.width + offset * 2;
        const contentHeight = surface.height + offset * 2;

        const scaleX = viewport.width / contentWidth;
        const scaleY = viewport.height / contentHeight;
        const newZoom = Math.min(scaleX, scaleY) * padding;

        // Center the whole content block, the padding inside will do the rest.
        const newPanX = (viewport.width - contentWidth * newZoom) / 2;
        const newPanY = (viewport.height - contentHeight * newZoom) / 2;

        set(state => {
            state.zoom = newZoom * 100;
            state.pan = { x: newPanX, y: newPanY };
        });
    },

    toggleModal: () =>
      set((state) => {
        state.isModalOpen = !state.isModalOpen;
      }),
    toggleRightSidebar: () =>
      set((state) => {
        state.isRightSidebarOpen = !state.isRightSidebarOpen;
      }),
  }))
);
