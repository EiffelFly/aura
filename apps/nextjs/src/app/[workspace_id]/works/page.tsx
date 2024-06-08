"use client";

import { LeftSidebar } from "~/components/overview";
import { Topbar } from "~/components/overview/topbar/topbar";
import { WorkList } from "~/components/work/work-list";

export default function WorkOverviewPage({
  params,
}: {
  params: { workspace_id: string };
}) {
  return (
    <div className="flex h-full flex-row">
      <LeftSidebar current_workspace_id={params.workspace_id} />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <div className="w-full p-4">
          <WorkList />
        </div>
      </div>
    </div>
  );
}
