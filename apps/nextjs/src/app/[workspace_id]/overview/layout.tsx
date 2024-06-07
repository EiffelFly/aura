import * as React from "react";

import { LeftSidebar } from "~/components/overview";
import { Topbar } from "~/components/overview/topbar/topbar";

export default function OverviewLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { workspace_id: string };
}) {
  return (
    <div className="flex h-full flex-row">
      <LeftSidebar current_workspace_id={params.workspace_id} />
      <div className="flex flex-1 flex-col">
        <Topbar />
        {children}
      </div>
    </div>
  );
}
