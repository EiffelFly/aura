"use client";

import * as React from "react";

import { LeftSidebar } from "./left-sidebar";
import { Topbar } from "./topbar/topbar";

export const OverviewContainer = ({
  workspace_id,
  children,
}: {
  workspace_id: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex h-full flex-row">
      <LeftSidebar current_workspace_id={workspace_id} />
      <div className="flex flex-1 flex-col">
        <Topbar />
        <div className="w-full p-4">{children}</div>
      </div>
    </div>
  );
};
