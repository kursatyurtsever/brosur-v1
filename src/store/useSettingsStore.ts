
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { GlobalLayoutSettings } from '../types';

interface SettingsState {
  language: 'tr' | 'en';
  autoSaveInterval: number; // in milliseconds
  layout: GlobalLayoutSettings;
}

interface SettingsActions {
  setLanguage: (language: 'tr' | 'en') => void;
  setAutoSaveInterval: (interval: number) => void;
  setLayout: (settings: Partial<GlobalLayoutSettings>) => void;
}

const initialState: SettingsState = {
  language: 'tr',
  autoSaveInterval: 30000, // 30 seconds
  layout: {
    gap: 2,           // mm cinsinden hücreler arası boşluk
    footerHeightMm: 15,
    rows: 4,               // Sabit. Değiştirilemez.
    cols: 4                // Sabit. Değiştirilemez.
  },
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    immer((set) => ({
      ...initialState,

      setLanguage: (language) =>
        set((state) => {
          state.language = language;
        }),

      setAutoSaveInterval: (interval) =>
        set((state) => {
          state.autoSaveInterval = interval;
        }),
        
      setLayout: (settings) => 
        set((state) => {
            state.layout = { ...state.layout, ...settings };
        }),
    })),
    {
      name: 'matbaa-settings-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
