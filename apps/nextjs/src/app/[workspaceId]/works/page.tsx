"use client";

import { OverviewContainer } from "~/components/overview/OverviewContainer";
import { WorkList } from "~/components/work/work-list";

export default function WorkOverviewPage({
  params,
}: {
  params: { workspaceId: string };
}) {
  return (
    <OverviewContainer workspaceId={params.workspaceId}>
      <WorkList workspaceId={params.workspaceId} />
    </OverviewContainer>
  );
}
