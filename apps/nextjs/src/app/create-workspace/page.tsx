import { CreateWorkspace } from "~/components/create-workspace";

export default async function CreateWorkspacePage() {
  return (
    <div className="mx-auto h-full max-w-[var(--centralized-content-width)] py-[180px]">
      <CreateWorkspace />
    </div>
  );
}
