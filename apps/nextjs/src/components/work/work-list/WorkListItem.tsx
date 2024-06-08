import { useRouter } from "next/navigation";

import { useWorkspaceId } from "~/hook/use-workspace-id";

export const WorkListItem = ({
  id,
  name,
  updated_at,
}: {
  id: string;
  name: string;
  updated_at: Date | null;
}) => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  return (
    <button
      onClick={() => {
        if (!workspaceId) {
          return;
        }

        router.push(`/${workspaceId}/works/${id}`);
      }}
      className="flex flex-row justify-between rounded-sm border border-accent px-4 py-3 hover:bg-muted"
    >
      <div className="flex flex-row">
        <p className="font-sans text-base font-normal text-secondary">{name}</p>
      </div>
      <div className="flex flex-row text-base text-border">
        {updated_at?.toLocaleTimeString()}
      </div>
    </button>
  );
};
