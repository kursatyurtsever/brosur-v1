
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface LayerState {
  activeLayerId: string | null;
}

interface LayerActions {
  setActiveLayer: (layerId: string | null) => void;
}

export const useLayerStore = create<LayerState & LayerActions>()(
  immer((set) => ({
    activeLayerId: null,

    setActiveLayer: (layerId) =>
      set((state) => {
        state.activeLayerId = layerId;
      }),
  }))
);
