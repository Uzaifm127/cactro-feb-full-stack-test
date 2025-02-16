"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export const CreatePollClient = () => {
  const [question, setQuestion] = useState("");
  const [pollCreationLoading, setPollCreationLoading] = useState(false);
  const [name, setName] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const router = useRouter();

  const addOption = useCallback(() => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  }, [options]);

  const removeOption = useCallback(
    (index: number) => {
      if (options.length > 2) {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
      }
    },
    [options]
  );

  const handleOptionChange = useCallback(
    (index: number, value: string) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    },
    [options]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        setPollCreationLoading(true);

        const responseObject = await fetch(`/api/poll/create`, {
          method: "POST",
          body: JSON.stringify({ question, options, username: name } as {
            question: string;
            options: Array<string>;
            username: string;
          }),
        });

        const response = await responseObject.json();

        router.push(`/poll/${response.pollId}`);
      } catch (error) {
        console.error(error);
      } finally {
        setPollCreationLoading(false);
      }
    },
    [question, options, name, router]
  );

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Create a Poll</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Your name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Question
              </label>
              <Input
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your poll question"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Options
              </label>
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  {index >= 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 4 && (
              <Button
                type="button"
                variant="outline"
                onClick={addOption}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Option
              </Button>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            onClick={handleSubmit}
            disabled={pollCreationLoading}
          >
            {pollCreationLoading ? "Creating a poll" : "Create Poll"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
