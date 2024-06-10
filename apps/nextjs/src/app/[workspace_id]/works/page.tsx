"use client";

import { OverviewContainer } from "~/components/overview/OverviewContainer";
import { WorkList } from "~/components/work/work-list";

export default function WorkOverviewPage({
  params,
}: {
  params: { workspace_id: string };
}) {
  return (
    <OverviewContainer workspace_id={params.workspace_id}>
      <WorkList workspace_id={params.workspace_id} />
    </OverviewContainer>
  );
}
