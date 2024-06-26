import { Handle, NodeProps, Position } from "reactflow";

import { DialogueNodeData } from "./DialoguesForceGraph";

export const CharacterNode = ({ data, id }: NodeProps<DialogueNodeData>) => {
  return (
    <div className="relative h-10 w-10  bg-secondary">
      {data.content}
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
