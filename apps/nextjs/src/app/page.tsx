"use client";

import Editor from "~/components/editor";
import { Overview } from "~/components/overview";
import { AuraStore, useAuraStore, useShallow } from "~/use-aura-store";

export const runtime = "edge";

const selector = (store: AuraStore) => ({
  isEditorView: store.isEditorView,
});

export default function HomePage() {
  const { isEditorView } = useAuraStore(useShallow(selector));

  return (
    <main className="h-screen">
      {isEditorView ? <Editor markdown="##test" /> : <Overview />}
    </main>
  );
}
