"use client";

import { supabaseClient } from "@/utils/supabase/client";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";

export const Content = () => {
  const supabase = supabaseClient();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topic, setTopic] = useState<string>("");
  const [essay, setEssay] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleSelectChange = (value: string) => {
    setSelectedTopic(value);
  };

  const handleTextChange = (event: any) => {
    setEssay(event.target.value);
  };

  const createTopic = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("openai", {
        body: {
          query: `Can you create me a ${selectedTopic} essay question topic. the topic question should be at least 150 char and maximum 250 char. the question should be formatted based on IELTS exams.`,
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      setTopic(data);
    } catch (error) {
      console.error("Error calling edge function:", error);
      setError("An error occurred while calling the edge function.");
    } finally {
      setLoading(false);
    }
  };

  const giveFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("openai", {
        body: {
          query: `Calculate the mark of given essay from scale 1 to 9. The calculation of mark should be based on IELTS exams. After calculation, give feedbacks to improve the essay and make some suggestions. This is the question topic of essay: ${topic}. This is the essay given by the user: ${essay}`,
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      setFeedback(data);
    } catch (error) {
      console.error("Error calling edge function:", error);
      setError("An error occurred while calling the edge function.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 items-center w-full h-full py-10 px-10">
      <div className="w-full gap-10 flex justify-center">
        <Select onValueChange={(value) => handleSelectChange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select an Essay Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Essay Type</SelectLabel>
              <SelectItem value="opinion">Opinion</SelectItem>
              <SelectItem value="discussion">Discussion</SelectItem>
              <SelectItem value="solution">Solution</SelectItem>
              <SelectItem value="direct">Direct</SelectItem>
              <SelectItem value="adv">Advantages / Disadvantages</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={createTopic} disabled={loading}>
          Create Topic
        </Button>

        <Button onClick={giveFeedback} disabled={loading}>
          Give Feedback
        </Button>
      </div>

      <Card className="w-full h-20">
        {loading ? "Loading..." : error ? error : topic}
      </Card>

      <Textarea
        onChange={(e) => handleTextChange(e)}
        className="w-full h-96"
        placeholder="Type your essay here."
      />

      <Card className="w-full h-96">
        {loading ? "Loading..." : error ? error : feedback}
      </Card>
    </div>
  );
};
