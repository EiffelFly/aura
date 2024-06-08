"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import * as React from "react";
import dynamic from "next/dynamic";
import throttle from "lodash.throttle";

import { Skeleton } from "@aura/ui/skeleton";

import { api } from "~/trpc/react";

const Editor = dynamic(() => import("~/components/editor"), { ssr: false });

export default function WorkPage({
  params: { work_id },
}: {
  params: { work_id: string };
}) {
  const ref = React.useRef<MDXEditorMethods>(null);
  const work = api.work.byId.useQuery({ id: work_id });

  const utils = api.useUtils();
  const updateWork = api.work.update.useMutation({
    onSuccess: (data) => {
      if (data[0]) {
        utils.work.byId.setData({ id: data[0].id }, () => data[0]);
      }
    },
  });

  const throttledUpdateWork = React.useCallback(
    throttle(updateWork.mutate, 1000),
    [updateWork.mutate],
  );

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        ref.current?.focus();
      }}
      className="h-full w-full"
    >
      <div className="relative mx-auto flex h-full max-w-[var(--centralized-content-width)] flex-col gap-y-10 py-[150px]">
        {work.isSuccess &&
        (work.data?.content === "" || !work.data?.content) ? (
          <div className="absolute h-0.5 w-4 -translate-y-5 bg-secondary"></div>
        ) : null}
        {work.isSuccess ? (
          <Editor
            onChange={(markdown) => {
              throttledUpdateWork({
                work_id,
                content: markdown,
              });
            }}
            editorRef={ref}
            markdown={work.data?.content ?? ""}
          />
        ) : (
          <div className="flex flex-col gap-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        )}
      </div>
    </div>
  );
}
