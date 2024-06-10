"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash.debounce";

import { useWorkspaceId } from "~/hook/use-workspace-id";
import { useUpdateWorkOnSuccessUpdater } from "~/trpc/helper/work";
import { api } from "~/trpc/react";

export const WorkListItem = ({
  id,
  name,
  updated_at,
}: {
  id: string;
  name: string;
  updated_at: Date | null;
}) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [workListItemName, setWorkListItemName] = React.useState(name);
  const [isHoverOnNameInput, setIsHoverOnNameInput] = React.useState(false);

  const debouncedHoverOnNameInput = React.useCallback(
    debounce((value: boolean) => {
      console.log("deb");
      setIsHoverOnNameInput(value);
    }, 100),
    [],
  );

  const updateWorkOnSuccessUpdater = useUpdateWorkOnSuccessUpdater();
  const updateWork = api.works.update.useMutation({
    onSuccess: (data) => {
      const target = data[0];
      if (target) {
        updateWorkOnSuccessUpdater(data);
      }
    },
  });

  return (
    <button
      onClick={() => {
        if (!workspaceId || isHoverOnNameInput) {
          return;
        }

        router.push(`/${workspaceId}/works/${id}`);
      }}
      className="group relative flex h-12 flex-row items-center justify-between rounded-sm border border-accent px-4 hover:bg-muted"
    >
      <div className="flex h-full w-1/2 flex-row">
        <input
          value={workListItemName}
          onChange={(value) => {
            setWorkListItemName(value.target.value);
          }}
          className="h-full w-full bg-background font-sans text-base font-normal text-secondary focus:outline-none focus:ring-0 group-hover:bg-muted"
          onMouseEnter={() => {
            debouncedHoverOnNameInput(true);
          }}
          onMouseLeave={() => {
            debouncedHoverOnNameInput(false);
          }}
          onBlur={() => {
            if (workListItemName === name) {
              return;
            }
            updateWork.mutate({
              work_id: id,
              name: workListItemName,
            });
          }}
        />
      </div>
      <div className="flex flex-row text-base text-border">
        {updated_at?.toLocaleTimeString()}
      </div>
    </button>
  );
};
