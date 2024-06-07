import { Separator } from "@aura/ui/separator";

import { MainNavigations } from "./main-navigations";
import { WorkspaceSwitch } from "./workspace-switch";

export const LeftSidebar = ({
  current_workspace_id,
}: {
  current_workspace_id: string;
}) => {
  return (
    <div className="flex h-full w-[var(--left-sidebar-width)] flex-col border-r border-border">
      <div className="flex h-[var(--topbar-height)] flex-row items-center px-4">
        <WorkspaceSwitch current_workspace_id={current_workspace_id} />
      </div>
      <div className="flex p-4">
        <MainNavigations />
      </div>
      <Separator />
    </div>
  );
};
