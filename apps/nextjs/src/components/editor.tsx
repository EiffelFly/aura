"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
} from "@mdxeditor/editor";

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  placeholder?: string;
  onChange?: (markdown: string) => void;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor = ({
  markdown,
  editorRef,
  onChange,
  placeholder,
}: EditorProps) => {
  return (
    <article>
      <MDXEditor
        onChange={onChange}
        ref={editorRef}
        markdown={markdown}
        plugins={[headingsPlugin(), listsPlugin(), markdownShortcutPlugin()]}
        contentEditableClassName="prose-xl placeholder:text-accent h-full font-mono prose-neutral dark:prose-invert !max-w-none focus:!border-0 focus:!outline-none focus:ring-0"
        placeholder={placeholder}
      />
    </article>
  );
};

export default Editor;
