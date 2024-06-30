"use client";

import * as React from "react";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  SimulationLinkDatum,
  SimulationNodeDatum,
} from "d3-force";
import { Node, ReactFlowState, useReactFlow, useStore } from "reactflow";

type UseForceLayoutOptions = {
  strength: number;
  distance: number;
};

type SimNodeType = SimulationNodeDatum & Node;

const elementCountSelector = (state: ReactFlowState) =>
  state.nodeInternals.size + state.edges.length;
const nodesInitializedSelector = (state: ReactFlowState) =>
  Array.from(state.nodeInternals.values()).every(
    (node) => node.width && node.height,
  );

function useForceLayout({ strength, distance }: UseForceLayoutOptions) {
  const elementCount = useStore(elementCountSelector);
  const nodesInitialized = useStore(nodesInitializedSelector);
  const zoom = useStore((state) => state.transform[2]);
  const { setNodes, getNodes, getEdges } = useReactFlow();

  const nodes = getNodes();
  const edges = getEdges();

  // Debounce the whole computation
  React.useEffect(() => {
    console.log(nodes, nodesInitialized);

    if (!nodes.length || !nodesInitialized) {
      return;
    }

    const simulationNodes: SimNodeType[] = nodes.map((node) => ({
      ...node,
      x: node.position.x,
      y: node.position.y,
    }));

    const simulationLinks: SimulationLinkDatum<SimNodeType>[] = edges.map(
      (edge) => edge,
    );

    const simulation = forceSimulation()
      .nodes(simulationNodes)
      .force("charge", forceManyBody().strength(-100))
      .force(
        "link",
        forceLink(simulationLinks)
          .id((d: any) => d.id)
          .strength(1)
          .distance(5),
      )
      .force(
        "collide",
        forceCollide()
          .strength(2)
          .radius((d: any) => d.width / 2 + 100),
      )
      .alphaDecay(0.05)
      .velocityDecay(0.9)
      .force("x", forceX().x(0).strength(0.1))
      .force("y", forceY().y(0).strength(0.1))
      .on("tick", () => {
        console.log("tick");

        setNodes(
          simulationNodes.map((node) => ({
            ...node,
            id: node.id,
            data: node.data,
            position: { x: node.x ?? 0, y: node.y ?? 0 },
            className: node.className,
          })),
        );
      });

    return () => {
      simulation.stop();
    };
  }, [
    elementCount,
    getNodes,
    getEdges,
    setNodes,
    strength,
    distance,
    nodesInitialized,
    zoom,
  ]);
}

export default useForceLayout;
