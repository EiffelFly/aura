"use client";

import { useRouter } from "next/navigation";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import { Popover, PopoverContent, PopoverTrigger } from "@aura/ui/popover";
import { Separator } from "@aura/ui/separator";

export const WorkspaceSwitch = () => {
  const router = useRouter();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex flex-row items-center gap-x-3 rounded px-2 py-0.5 hover:bg-muted">
          <span className="font-sans text-lg font-semibold text-secondary">
            Your workspace
          </span>
          <ChevronDownIcon className="h-3 w-3 stroke-secondary" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] border-none bg-muted p-0"
        align="start"
      >
        <div className="flex flex-col">
          <div className="p-2 font-sans text-xs font-medium text-border">
            fly123456@gmail.com
          </div>
          <Separator />
          <ActionButton
            title="Create new workspace"
            onClick={() => {
              router.push("/create-workspace");
            }}
          />
          <Separator />
          <ActionButton title="logout" onClick={() => {}} />
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
