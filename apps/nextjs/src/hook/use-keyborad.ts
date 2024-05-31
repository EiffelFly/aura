import * as React from "react";

import { AuraStore, useAuraStore, useShallow } from "~/use-aura-store";

const selector = (store: AuraStore) => ({
  updateIsEditorView: store.updateIsEditorView,
});

export const useKeyboard = () => {
  const { updateIsEditorView } = useAuraStore(useShallow(selector));

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "g" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        updateIsEditorView((prev) => !prev);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
};
