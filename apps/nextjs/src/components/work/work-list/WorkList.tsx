import { api } from "~/trpc/react";
import { WorkListItem } from "./WorkListItem";

export const WorkList = ({ workspace_id }: { workspace_id: string }) => {
  const works = api.works.all.useQuery({ workspace_id });

  return (
    <div className="flex w-full flex-col gap-y-4">
      {works.isSuccess
        ? works.data.map((work) => (
            <WorkListItem
              id={work.id}
              name={work.name}
              updated_at={work.updated_at}
              workspace_id={workspace_id}
            />
          ))
        : null}
    </div>
  );
};
