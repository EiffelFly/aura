"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil1Icon } from "@radix-ui/react-icons";

import { Button } from "@aura/ui/button";
import { Separator } from "@aura/ui/separator";
import { toast } from "@aura/ui/toast";

import { api } from "~/trpc/react";
import { MainNavigations } from "./main-navigations";
import { WorkspaceSwitch } from "./workspace-switch";

export const LeftSidebar = ({
  currentWorkspaceId,
}: {
  currentWorkspaceId: string;
}) => {
  const router = useRouter();
  const utils = api.useUtils();

  const [isLoading, setIsLoading] = React.useState(false);

  const createWork = api.works.create.useMutation({
    onSuccess: async (data) => {
      await utils.works.invalidate();

      if (data[0]) {
        router.push(`/${currentWorkspaceId}/works/${data[0].id}`);
      }
    },
    onError: () => {
      toast.error("Failed to create work");
    },
  });

  return (
    <div className="flex h-full w-[var(--left-sidebar-width)] flex-shrink-0 flex-col border-r border-border">
      <div className="flex h-[var(--topbar-height)] flex-row items-center justify-between px-4">
        <WorkspaceSwitch currentWorkspaceId={currentWorkspaceId} />
        <Button
          onClick={() => {
            createWork.mutate({
              workspaceId: currentWorkspaceId,
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
      <div className="flex flex-col p-4">
        <button
          onClick={async () => {
            try {
              setIsLoading(true);
              await fetch("/api/ai", {
                method: "POST",
                body: JSON.stringify({
                  workspaceId: currentWorkspaceId,
                }),
              });
              setIsLoading(false);
            } catch (error) {
              setIsLoading(false);
              console.log(error);
            }
          }}
          className="mb-4 rounded bg-accent py-2"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Magic Wand"}
        </button>
        <MainNavigations />
      </div>
      <Separator />
    </div>
  );
};
