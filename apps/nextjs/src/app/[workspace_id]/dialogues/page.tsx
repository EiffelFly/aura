"use client";

import { OverviewContainer } from "~/components/overview/OverviewContainer";

export default function DialogueOverviewPage({
  params,
}: {
  params: { workspace_id: string };
}) {
  return (
    <OverviewContainer workspace_id={params.workspace_id}></OverviewContainer>
  );
}
