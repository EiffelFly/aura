import { api } from "~/trpc/react";
import { WorkListItem } from "./WorkListItem";

export const WorkList = () => {
  const works = api.work.all.useQuery();

  return (
    <div className="flex w-full flex-col gap-y-4">
      {works.isSuccess
        ? works.data.map((work) => (
            <WorkListItem
              id={work.id}
              name={work.name}
              updated_at={work.updated_at}
            />
          ))
        : null}
    </div>
  );
};
