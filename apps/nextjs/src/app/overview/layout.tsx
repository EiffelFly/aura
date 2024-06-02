import * as React from "react";

import { LeftSidebar } from "~/components/overview";
import { Topbar } from "~/components/overview/topbar/topbar";

export default function OverviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-row">
      <LeftSidebar />
      <div className="flex flex-1 flex-col">
        <Topbar />
        {children}
      </div>
    </div>
  );
}
