"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import * as React from "react";
import dynamic from "next/dynamic";

import { Overview } from "~/components/overview";
import { useKeyboard } from "~/hook/use-keyborad";
import { AuraStore, useAuraStore, useShallow } from "~/use-aura-store";

const Editor = dynamic(() => import("~/components/editor"), { ssr: false });

export const runtime = "edge";

const selector = (store: AuraStore) => ({
  isEditorView: store.isEditorView,
});

export default function HomePage() {
  const ref = React.useRef<MDXEditorMethods>(null);
  const { isEditorView } = useAuraStore(useShallow(selector));

  useKeyboard();

  return (
    <main
      className="h-screen"
      onClick={() => {
        ref.current?.focus();
      }}
    >
      {isEditorView ? (
        <div className="mx-auto h-full max-w-[960px] py-[150px]">
          <Editor editorRef={ref} markdown="## test" />
        </div>
      ) : (
        <Overview />
      )}
    </main>
  );
}
