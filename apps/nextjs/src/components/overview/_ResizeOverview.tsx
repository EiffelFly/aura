"use client";

import * as React from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@aura/ui/resizable";

import { useWindowSize } from "~/hook/use-window-size";
import { LeftSidebar } from "./left-sidebar/left-sidebar";

export const Overview = () => {
  const [disabledResize, setDisabledResize] = React.useState(false);
  const windowSize = useWindowSize();

  return (
    <ResizablePanelGroup
      onLayout={(layout) => {
        if (
          windowSize.width &&
          layout[0] &&
          layout[0] * windowSize.width > 450
        ) {
          setDisabledResize(true);
        }
      }}
      direction="horizontal"
    >
      <ResizablePanel
        defaultSize={1}
        minSize={20}
        maxSize={25}
        className=" border-r border-border"
      >
        <LeftSidebar />
      </ResizablePanel>
      <ResizableHandle disabled={disabledResize} />
      <ResizablePanel>
        <div />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
