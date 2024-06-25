import { RouterOutputs } from "@aura/api";

import { DialogueView } from "~/components/dialogue/DialoguesView";
import { OverviewContainer } from "~/components/overview/OverviewContainer";
import { api } from "~/trpc/server";

export default async function DialogueOverviewPage({
  params: { workspaceId },
}: {
  params: { workspaceId: string };
}) {
  const works = await api.works.worksWithVersions({ workspaceId });

  const dialogues: RouterOutputs["dialogues"]["allByVersion"] = [];

  for (const work of works) {
    if (work.workVersion[0]) {
      const workDialogues = await api.dialogues.allByVersion({
        workVersionId: work.workVersion[0]?.id,
        workspaceId,
        withCharacter: true,
      });

      dialogues.push(...workDialogues);
    }
  }

  return (
    <OverviewContainer workspaceId={workspaceId}>
      <DialogueView dialogues={dialogues} />
    </OverviewContainer>
  );
}
