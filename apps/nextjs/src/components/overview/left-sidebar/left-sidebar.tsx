import { WorkspaceSwitch } from "./workspace-switch";

export const LeftSidebar = () => {
  return (
    <div className="flex h-full w-[320px] flex-col border-r border-border">
      <div className="flex h-14 flex-row items-center px-4">
        <WorkspaceSwitch />
      </div>
    </div>
  );
};
