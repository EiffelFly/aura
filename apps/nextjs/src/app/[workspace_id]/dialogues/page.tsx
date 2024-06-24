import { RouterOutputs } from "@aura/api";

import { DialogueView } from "~/components/dialogue/DialoguesView";
import { OverviewContainer } from "~/components/overview/OverviewContainer";
import { api } from "~/trpc/server";

export default async function DialogueOverviewPage({
  params: { workspace_id },
}: {
  params: { workspace_id: string };
}) {
  const works = await api.works.works_with_versions({ workspace_id });

  const dialogues: RouterOutputs["dialogues"]["all_by_version"] = [];

  for (const work of works) {
    if (work.workVersion[0]) {
      const workDialogues = await api.dialogues.all_by_version({
        work_version_id: work.workVersion[0]?.id,
        workspace_id,
        with_character: true,
      });

      dialogues.push(...workDialogues);
    }
  }

  return (
    <OverviewContainer workspace_id={workspace_id}>
      <DialogueView dialogues={dialogues} />
    </OverviewContainer>
  );
}
