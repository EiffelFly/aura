import { Handle, NodeProps, Position } from "reactflow";

import { CharacterNodeData, DialogueNodeData } from "./DialoguesForceGraph";

export const CharacterNode = ({ data, id }: NodeProps<CharacterNodeData>) => {
  return (
    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
      <p className="flex text-center font-sans text-base text-foreground">
        {data.name}
      </p>
      <Handle
        type="source"
        position={Position.Right}
        id={id}
        className="!left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 !opacity-0"
        isConnectable={true}
      />
    </div>
  );
};
