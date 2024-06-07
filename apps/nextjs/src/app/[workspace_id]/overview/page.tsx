import { redirect } from "next/navigation";

export default async function OverviewPage({
  params,
}: {
  params: {
    workspace_id: string;
  };
}) {
  redirect(`/${params.workspace_id}/overview/works`);
}
