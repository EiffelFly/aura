import { BaseEdge, EdgeProps, getStraightPath } from "reactflow";

export const CustomEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
}: EdgeProps) => {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />;
};
