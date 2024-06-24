"use client";

import * as React from "react";
import ReactFlow, { Edge, Node, ReactFlowProvider } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import { RouterOutputs } from "@aura/api";

import { DialogueNodeData, DialoguesForceGraph } from "./DialoguesForceGraph";

export const DialogueView = ({
  dialogues,
}: {
  dialogues: RouterOutputs["dialogues"]["all_by_version"];
}) => {
  const graph = React.useMemo(() => {
    const nodes: Node<DialogueNodeData>[] = [];
    const edges: Edge[] = [];

    for (const dialogue of dialogues) {
      nodes.push({
        id: dialogue.id,
        data: {
          content: dialogue.content,
        },
        position: {
          x: 0,
          y: 0,
        },
      });

      console.log(dialogue);

      if (
        dialogue.character &&
        nodes.findIndex((e) => e.id === dialogue.character_id) === -1
      ) {
        nodes.push({
          id: dialogue.id,
          data: {
            content: dialogue.content,
          },
          position: {
            x: 0,
            y: 0,
          },
        });
      }

      edges.push({
        id: uuidv4(),
        source: dialogue.character_id,
        target: dialogue.id,
      });
    }

    return {
      nodes,
      edges,
    };
  }, [dialogues]);

  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <DialoguesForceGraph
          initialNodes={graph.nodes}
          initialEdges={graph.edges}
        />
      </ReactFlowProvider>
    </div>
  );
};
