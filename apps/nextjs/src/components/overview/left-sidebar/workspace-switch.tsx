import { ChevronDownIcon } from "@radix-ui/react-icons";

import { Popover, PopoverTrigger } from "@aura/ui/popover";

export const WorkspaceSwitch = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex flex-row items-center gap-x-3 rounded px-1 py-0.5 hover:bg-muted">
          <span className="font-sans font-semibold text-secondary">
            Your workspace
          </span>
          <ChevronDownIcon className="h-3 w-3 stroke-secondary" />
        </button>
      </PopoverTrigger>
    </Popover>
  );
};
