"use client";

import ReactFlow, {
  Edge,
  Node,
  NodeOrigin,
  useEdgesState,
  useNodesState,
} from "reactflow";

import useForceLayout from "~/hook/use-force-layout";

const nodeOrigin: NodeOrigin = [0.5, 0.5];

export type DialogueNodeData = {
  content: string | null;
};

export const DialoguesForceGraph = ({
  initialNodes,
  initialEdges,
}: {
  initialNodes: Node<DialogueNodeData>[];
  initialEdges: Edge[];
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useForceLayout({ strength: -1000, distance: 150 });

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      proOptions={{ hideAttribution: true }}
      nodeOrigin={nodeOrigin}
    ></ReactFlow>
  );
};
