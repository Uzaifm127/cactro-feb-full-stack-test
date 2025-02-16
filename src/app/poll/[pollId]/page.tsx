import { PollClient } from "./page-client";

export default function Poll({ params }: { params: { pollId: string } }) {
  const { pollId } = params;

  return <PollClient pollId={pollId} />;
}
