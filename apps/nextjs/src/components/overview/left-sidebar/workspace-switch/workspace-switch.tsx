"use client";

import { useRouter } from "next/navigation";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";

import { SignOutClient, useSession } from "@aura/auth";
import { Popover, PopoverContent, PopoverTrigger } from "@aura/ui/popover";
import { Separator } from "@aura/ui/separator";
import { Skeleton } from "@aura/ui/skeleton";

import { api } from "~/trpc/react";

export const WorkspaceSwitch = ({
  currentWorkspaceId,
}: {
  currentWorkspaceId: string;
}) => {
  const router = useRouter();
  const session = useSession();
  const workspaces = api.workspaces.all.useQuery();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex flex-row items-center gap-x-3 rounded px-2 py-0.5 hover:bg-muted">
          <span className="font-sans text-lg font-semibold text-secondary">
            {workspaces.isSuccess ? (
              workspaces.data.find(
                (workspace) => workspace.id === currentWorkspaceId,
              )?.name
            ) : (
              <Skeleton className="h-4 w-20 rounded" />
            )}
          </span>
          <ChevronDownIcon className="h-3 w-3 stroke-secondary" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] rounded border-none bg-muted p-0"
        align="start"
      >
        <div className="flex flex-col">
          <div className="p-2 font-sans text-xs font-medium text-border">
            {session.data?.user.email}
          </div>
          <div className="flex flex-col p-2">
            {workspaces.isSuccess
              ? workspaces.data.map((workspace) => (
                  <div className="flex w-full flex-row justify-between rounded px-2 py-1 hover:bg-border">
                    <p className="font-sans  text-base font-medium text-secondary">
                      {workspace.name}
                    </p>
                    {currentWorkspaceId === workspace.id ? (
                      <CheckIcon className="h-5 w-5 stroke-secondary" />
                    ) : null}
                  </div>
                ))
              : null}
          </div>
          <Separator />
          <ActionButton
            title="Create new workspace"
            onClick={() => {
              router.push("/create-workspace");
            }}
          />
          <Separator />

          <ActionButton title="logout" onClick={() => SignOutClient()} />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export const ActionButton = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => {
  return (
    <div className="flex w-full p-2">
      <button
        onClick={onClick}
        className="flex w-full rounded px-2 py-1 font-sans font-medium text-secondary hover:bg-border"
      >
        {title}
      </button>
    </div>
  );
};
