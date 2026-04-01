
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface UIState {
  selectedSlotId: string | null;
  activePanel: string | null;
  zoom: number;
  pan: { x: number; y: number };
  isModalOpen: boolean;
}

interface UIActions {
  setSelectedSlot: (slotId: string | null) => void;
  setActivePanel: (panel: string | null) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  toggleModal: () => void;
}

export const useUIStore = create<UIState & UIActions>()(
  immer((set) => ({
    selectedSlotId: null,
    activePanel: null,
    zoom: 100,
    pan: { x: 0, y: 0 },
    isModalOpen: false,

    setSelectedSlot: (slotId) =>
      set((state) => {
        state.selectedSlotId = slotId;
      }),

    setActivePanel: (panel) =>
      set((state) => {
        state.activePanel = panel;
      }),

    setZoom: (zoom) =>
      set((state) => {
        state.zoom = zoom;
      }),

    setPan: (pan) =>
      set((state) => {
        state.pan = pan;
      }),

    toggleModal: () =>
      set((state) => {
        state.isModalOpen = !state.isModalOpen;
      }),
  }))
);
