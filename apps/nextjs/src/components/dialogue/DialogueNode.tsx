"use client";

import { Handle, NodeProps, Position, useStore } from "reactflow";

import { cn } from "@aura/ui";

import { DialogueNodeData } from "./DialoguesForceGraph";

export const DialogueNode = ({ data, id }: NodeProps<DialogueNodeData>) => {
  const zoom = useStore((state) => state.transform[2]);

  return (
    <div
      className={cn(
        "relative flex max-w-[320px] bg-secondary p-4",
        zoom >= 1.0 ? "" : "",
      )}
    >
      {zoom >= 1.0 ? data.content : data.summary}
      <Handle
        type="target"
        position={Position.Right}
        id={id}
        className="!left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !opacity-0"
        isConnectable={true}
      />
    </div>
  );
};
