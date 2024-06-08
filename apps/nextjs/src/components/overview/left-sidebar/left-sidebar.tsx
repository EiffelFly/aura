"use client";

import { useRouter } from "next/navigation";
import { Pencil1Icon } from "@radix-ui/react-icons";

import { Button } from "@aura/ui/button";
import { Separator } from "@aura/ui/separator";
import { toast } from "@aura/ui/toast";

import { api } from "~/trpc/react";
import { MainNavigations } from "./main-navigations";
import { WorkspaceSwitch } from "./workspace-switch";

export const LeftSidebar = ({
  current_workspace_id,
}: {
  current_workspace_id: string;
}) => {
  const router = useRouter();
  const utils = api.useUtils();
  const createWork = api.work.create.useMutation({
    onSuccess: async (data) => {
      await utils.workspace.invalidate();

      if (data[0]) {
        router.push(`/${current_workspace_id}/works/${data[0].id}`);
      }
    },
    onError: () => {
      toast.error("Failed to create work");
    },
  });

  return (
    <div className="flex h-full w-[var(--left-sidebar-width)] flex-col border-r border-border">
      <div className="flex h-[var(--topbar-height)] flex-row items-center justify-between px-4">
        <WorkspaceSwitch current_workspace_id={current_workspace_id} />
        <Button
          onClick={() => {
            createWork.mutate({
              workspace_id: current_workspace_id,
              content: "",
              name: "Untitled",
            });
          }}
          variant="ghost"
          size="icon"
        >
          <Pencil1Icon className="h-4 w-4 stroke-secondary" />
        </Button>
      </div>
      <div className="flex p-4">
        <MainNavigations />
      </div>
      <Separator />
    </div>
  );
};
