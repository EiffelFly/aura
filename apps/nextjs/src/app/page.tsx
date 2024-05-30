"use client";

import dynamic from "next/dynamic";

import { Overview } from "~/components/overview";
import { AuraStore, useAuraStore, useShallow } from "~/use-aura-store";

const Editor = dynamic(() => import("~/components/editor"), { ssr: false });

export const runtime = "edge";

const selector = (store: AuraStore) => ({
  isEditorView: store.isEditorView,
});

export default function HomePage() {
  const { isEditorView } = useAuraStore(useShallow(selector));

  return (
    <main className="h-screen">
      {isEditorView ? (
        <div className="mx-auto max-w-[960px] py-[150px]">
          <Editor markdown="## test" />
        </div>
      ) : (
        <Overview />
      )}
    </main>
  );
}
