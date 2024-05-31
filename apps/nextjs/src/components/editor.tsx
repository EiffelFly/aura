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
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor = ({ markdown, editorRef }: EditorProps) => {
  return (
    <article>
      <MDXEditor
        onChange={(e) => console.log(e)}
        ref={editorRef}
        markdown={markdown}
        plugins={[headingsPlugin(), listsPlugin(), markdownShortcutPlugin()]}
        contentEditableClassName="prose-xl h-full font-mono prose-neutral dark:prose-invert !max-w-none focus:!border-0 focus:!outline-none focus:ring-0"
      />
    </article>
  );
};

export default Editor;
