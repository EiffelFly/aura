import { redirect } from "next/navigation";

import { auth } from "@aura/auth";

import { CreateWorkspace } from "~/components/create-workspace";

export default async function CreateWorkspacePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="mx-auto h-full max-w-[var(--centralized-content-width)] py-[180px]">
      <CreateWorkspace userId={session.user.id} />
    </div>
  );
}
