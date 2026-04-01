
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PrintSpec } from '../types';

interface SettingsState {
  language: 'tr' | 'en';
  autoSaveInterval: number; // in milliseconds
  defaultPrintSpec: PrintSpec;
}

interface SettingsActions {
  setLanguage: (language: 'tr' | 'en') => void;
  setAutoSaveInterval: (interval: number) => void;
  setDefaultPrintSpec: (spec: PrintSpec) => void;
}

const defaultSpec: PrintSpec = {
  bleed: 3,
  margin: 5,
  iccProfile: 'Coated FOGRA39',
};

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    immer((set) => ({
      language: 'tr',
      autoSaveInterval: 30000, // 30 seconds
      defaultPrintSpec: defaultSpec,

      setLanguage: (language) =>
        set((state) => {
          state.language = language;
        }),

      setAutoSaveInterval: (interval) =>
        set((state) => {
          state.autoSaveInterval = interval;
        }),
        
      setDefaultPrintSpec: (spec) => 
        set((state) => {
            state.defaultPrintSpec = spec;
        }),
    })),
    {
      name: 'matbaa-settings-v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
