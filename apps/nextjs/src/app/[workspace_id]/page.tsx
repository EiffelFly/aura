"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import * as React from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("~/components/editor"), { ssr: false });

export default function HomePage() {
  const ref = React.useRef<MDXEditorMethods>(null);

  return (
    <div
      onClick={() => {
        ref.current?.focus();
      }}
      className="h-full w-full"
    >
      <div className="mx-auto h-full max-w-[var(--centralized-content-width)] py-[150px]">
        <Editor editorRef={ref} markdown="## test" />
      </div>
    </div>
  );
}
