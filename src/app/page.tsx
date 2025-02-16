import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <a href="/create">
        <Button>Create a poll</Button>
      </a>
    </div>
  );
}
