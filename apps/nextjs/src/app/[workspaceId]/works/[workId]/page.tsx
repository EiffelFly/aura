"use client";

import type { MDXEditorMethods } from "@mdxeditor/editor";
import * as React from "react";
import dynamic from "next/dynamic";
import throttle from "lodash.throttle";

import { Skeleton } from "@aura/ui/skeleton";

import { useUpdateWorkOnSuccessUpdater } from "~/trpc/helper/work";
import { api } from "~/trpc/react";

const Editor = dynamic(() => import("~/components/editor"), { ssr: false });

export default function WorkPage({
  params: { workId, workspaceId },
}: {
  params: { workspaceId: string; workId: string };
}) {
  const ref = React.useRef<MDXEditorMethods>(null);
  const work = api.works.byId.useQuery({ workId });

  const updateWorkOnSuccessUpdater = useUpdateWorkOnSuccessUpdater({
    workspaceId,
  });

  const updateWork = api.works.update.useMutation({
    onSuccess: (data) => {
      const target = data[0];
      if (target) {
        updateWorkOnSuccessUpdater(data);
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
      <div className="relative mx-auto flex h-full max-w-[var(--centralized-content-width)] flex-col gap-y-10 pt-[150px]">
        {work.isSuccess &&
        (work.data?.content === "" || !work.data?.content) ? (
          <div className="absolute h-0.5 w-4 -translate-y-5 bg-secondary"></div>
        ) : null}
        {work.isSuccess ? (
          <Editor
            onChange={(markdown) => {
              throttledUpdateWork({
                workId,
                content: markdown,
                processed: false,
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
