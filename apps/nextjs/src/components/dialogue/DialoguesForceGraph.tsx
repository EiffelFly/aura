"use client";

import ReactFlow, {
  Background,
  Edge,
  Node,
  NodeOrigin,
  useEdgesState,
  useNodesState,
} from "reactflow";

import useForceLayout from "~/hook/use-force-layout";
import { CharacterNode } from "./CharacterNode";
import { CustomEdge } from "./CustomEdge";
import { DialogueNode } from "./DialogueNode";

const nodeOrigin: NodeOrigin = [0.5, 0.5];

export type DialogueNodeData = {
  content: string | null;
  summary: string | null;
};

export type CharacterNodeData = {
  name: string | null;
};

export type DialoguesForceGraphNodeData = DialogueNodeData | CharacterNodeData;

const nodeTypes = {
  dialogueNode: DialogueNode,
  characterNode: CharacterNode,
};

const edgeTypes = {
  customEdge: CustomEdge,
};

export const DialoguesForceGraph = ({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node<DialoguesForceGraphNodeData>[];
  initialEdges: Edge[];
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useForceLayout({ strength: 200, distance: 400 });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      proOptions={{ hideAttribution: true }}
      nodeOrigin={nodeOrigin}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView={true}
      fitViewOptions={{
        duration: 500,
        padding: 40,
      }}
    >
      <Background />
    </ReactFlow>
  );
};
