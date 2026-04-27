import { create } from 'zustand';

type SettingsStore = {
  denseMode: boolean;
  setDenseMode: (value: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  denseMode: false,
  setDenseMode: (value) => set({ denseMode: value })
}));
