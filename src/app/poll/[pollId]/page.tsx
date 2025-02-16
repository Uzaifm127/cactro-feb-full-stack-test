import { PollClient } from "./page-client";

export default async function Poll({
  params,
}: {
  params: Promise<{ pollId: string }>;
}) {
  const { pollId } = await params;

  return <PollClient pollId={pollId} />;
}
