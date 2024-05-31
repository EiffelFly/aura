"use client";

import * as React from "react";

import { LeftSidebar } from "./left-sidebar/left-sidebar";

export const Overview = () => {
  return (
    <div className="flex h-full flex-row">
      <LeftSidebar />
    </div>
  );
};
