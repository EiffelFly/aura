import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

export default async function RootPage() {
  const workspaces = await api.workspace.all();

  if (workspaces.length === 0 || !workspaces[0]) {
    return redirect("/onboarding");
  } else {
    return redirect(`/${workspaces[0].id}/works`);
  }
}
