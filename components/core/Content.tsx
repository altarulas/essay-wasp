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
import { useDispatch, useSelector } from "react-redux";
import {
  addEssayAndFeedback,
  addQuestion,
} from "@/store/features/tempEssaySlice";
import { AppDispatch, RootState } from "@/store/store";

export const Content = () => {
  const supabase = supabaseClient();
  const dispatch = useDispatch<AppDispatch>();

  const essay_question = useSelector(
    (state: RootState) => state.tempEssay.essay_question
  );
  const essay_feedback = useSelector(
    (state: RootState) => state.tempEssay.essay_feedback
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedTopic, setSelectedTopic] = useState("");
  const [essay, setEssay] = useState("");

  const handleSelectChange = (value: string) => {
    setSelectedTopic(value);
  };

  const handleTextChange = (event: any) => {
    setEssay(event.target.value);
  };

  const handleCreateTopic = async () => {
    setLoading(true);
    await dispatch(addQuestion(selectedTopic));
    setLoading(false);
  };

  const handleFinishEssay = async () => {
    alert("nice job essay is finished...");
  };

  const handleGetFeedback = async () => {
    setLoading(true);
    await dispatch(
      addEssayAndFeedback({ essay_text: essay, essay_question: essay_question })
    );
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-10 items-center w-full h-full py-10 px-10">
      {essay_question && "time started..."}
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

        <Button onClick={handleCreateTopic} disabled={loading}>
          Create Topic
        </Button>

        <Button onClick={handleFinishEssay} disabled={loading}>
          Finish Essay
        </Button>

        <Button onClick={handleGetFeedback} disabled={loading}>
          Give Feedback
        </Button>
      </div>

      <Card className="w-full h-20">
        {loading ? "Loading..." : essay_question}
      </Card>

      <Textarea
        onChange={(e) => handleTextChange(e)}
        className="w-full h-96"
        placeholder="Type your essay here."
      />

      <Card className="w-full h-96">
        {loading ? "Loading..." : essay_feedback}
      </Card>
    </div>
  );
};
