import { api } from "~/trpc/react";
import { WorkListItem } from "./WorkListItem";

export const WorkList = ({ workspaceId }: { workspaceId: string }) => {
  const works = api.works.all.useQuery({ workspaceId });

  return (
    <div className="flex w-full flex-col gap-y-4">
      {works.isSuccess
        ? works.data.map((work) => (
            <WorkListItem
              id={work.id}
              name={work.name}
              updatedAt={work.updatedAt}
            />
          ))
        : null}
    </div>
  );
};
