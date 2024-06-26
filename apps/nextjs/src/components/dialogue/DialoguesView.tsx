"use client";

import * as React from "react";
import { Edge, Node, ReactFlowProvider } from "reactflow";
import { v4 as uuidv4 } from "uuid";

import { RouterOutputs } from "@aura/api";

import {
  DialoguesForceGraph,
  DialoguesForceGraphNodeData,
} from "./DialoguesForceGraph";

export const DialogueView = ({
  dialogues,
}: {
  dialogues: RouterOutputs["dialogues"]["allByVersion"];
}) => {
  const graph = React.useMemo(() => {
    const nodes: Node<DialoguesForceGraphNodeData>[] = [];
    const edges: Edge[] = [];

    console.log(dialogues);

    for (const dialogue of dialogues) {
      nodes.push({
        id: dialogue.id,
        type: "dialogueNode",
        data: {
          content: dialogue.content,
          summary: dialogue.summary,
        },
        position: {
          x: 0,
          y: 0,
        },
      });

      if (
        dialogue.character &&
        nodes.findIndex((e) => e.id === dialogue.characterId) === -1
      ) {
        nodes.push({
          id: dialogue.characterId,
          type: "characterNode",
          data: {
            name: dialogue.character.name,
          },
          position: {
            x: 0,
            y: 0,
          },
        });
      }

      edges.push({
        id: uuidv4(),
        type: "customEdge",
        source: dialogue.characterId,
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
