"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Option } from "@prisma/client";

export function PollClient({ pollId }: { pollId: string }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Array<Option> | undefined>();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [pollOwner, setPollOwner] = useState("");
  const [fetchLoadingStopAfterFirstFetch, setFetchLoadingStopAfterfirstFetch] =
    useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(!!localStorage.getItem("hasVoted"));

  useEffect(() => {
    async function getPoll() {
      try {
        if (!fetchLoadingStopAfterFirstFetch) {
          setFetchLoading(true);
        }

        const responseObject = await fetch(`/api/poll/fetch/${pollId}`, {
          method: "GET",
        });

        const response = await responseObject.json();

        setQuestion(response.poll.question);
        setPollOwner(response.poll.owner);

        setFetchLoadingStopAfterfirstFetch(true);
        setOptions(response.poll.options as Array<Option>);
      } catch (error) {
        console.error(error);
      } finally {
        setFetchLoading(false);
      }
    }

    const timerId = setInterval(getPoll, 5000);

    return () => clearInterval(timerId);
  }, [pollId, fetchLoadingStopAfterFirstFetch]);

  const sharePoll = useCallback(async () => {
    // This will only work in production
    await window.navigator?.clipboard.writeText(window.location.href);

    alert("URL copied, you can share the poll via URL");
  }, []);

  const handleVote = useCallback(async () => {
    if (selectedOption) {
      try {
        setVoteLoading(true);

        const responseObject = await fetch("/api/poll/vote", {
          method: "POST",
          body: JSON.stringify({ optionId: selectedOption } as {
            optionId: string;
          }),
        });

        const response = await responseObject.json();

        setHasVoted(true);
        localStorage.setItem("hasVoted", "voted");
        setResponseMessage(response.message);
      } catch (error) {
        console.error(error);
      } finally {
        setVoteLoading(false);
      }
    }
  }, [selectedOption]);

  const totalVotes = options?.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {fetchLoading ? (
        <div className="flex items-center justify-center w-screen h-screen">
          <h2 className="text-3xl animate-pulse font-bold text-center">
            Loading the poll...
          </h2>
        </div>
      ) : (
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <h1 className="text-gray-600">{pollOwner}</h1>
            <CardTitle>{question}</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasVoted ? (
              <RadioGroup
                value={selectedOption || ""}
                onValueChange={setSelectedOption}
              >
                {options?.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id}>{option.option}</Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                {options?.map((option) => (
                  <div key={option.id}>
                    <div className="flex justify-between mb-1">
                      <span>{option.option}</span>
                      <span>
                        {option.votes
                          ? ((option.votes / totalVotes!) * 100).toFixed(1)
                          : 0}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (option.votes / (totalVotes ? totalVotes : 1)) * 100
                      }
                      className="h-2"
                    />
                  </div>
                ))}
                <p className="text-sm text-gray-500 mt-2">
                  Total votes: {totalVotes}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-3">
            {!hasVoted ? (
              <Button
                onClick={handleVote}
                disabled={!selectedOption || voteLoading}
                className="w-full"
              >
                {voteLoading ? "Please wait..." : "Vote"}
              </Button>
            ) : (
              <p className="text-center w-full text-green-600">
                {responseMessage}
              </p>
            )}

            {question && (
              <Button onClick={sharePoll} className="w-full">
                Share
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
