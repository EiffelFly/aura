export type GeneralSlice = {
  isEditorView: boolean;
  updateIsEditorView: (fn: (prev: boolean) => boolean) => void;
};

export type AuraStore = GeneralSlice;

export type AuraStoreMutators = [
  ["zustand/devtools", never],
  ["zustand/subscribeWithSelector", never],
];
