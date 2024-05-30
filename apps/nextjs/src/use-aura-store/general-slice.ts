import { StateCreator } from "zustand";

import { AuraStore, AuraStoreMutators, GeneralSlice } from "./type";

export const createGeneralSlice: StateCreator<
  AuraStore,
  AuraStoreMutators,
  [],
  GeneralSlice
> = (set) => ({
  isEditorView: true,
  updateIsEditorView: (fn) =>
    set((prev) => ({ isEditorView: fn(prev.isEditorView) })),
});
