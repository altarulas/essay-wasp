"use client";

import { supabaseClient } from "@/utils/supabase/client";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { useDispatch, useSelector } from "react-redux";
import {
  createFeedback,
  getUserEssay,
  startEssaySession,
} from "@/redux/features/essaySlice";
import { getUserInfo } from "@/redux/features/userInfoSlice";
import { AppDispatch, RootState } from "@/redux/store";

export const Content = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { essay_question, essay_feedback, essay_text } = useSelector(
    (state: RootState) => state.essay
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [essay, setEssay] = useState<string>("");

  const handleFetchInitialData = async () => {
    await dispatch(getUserInfo());
    await dispatch(getUserEssay());
  };

  useEffect(() => {
    essay_text && setEssay(essay_text);
  }, [essay_text]);

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  const handleSelectChange = (value: string) => {
    setSelectedTopic(value);
  };

  const handleCreateTopic = async () => {
    setLoading(true);
    await dispatch(startEssaySession(selectedTopic));
    setLoading(false);
  };

  const handleEssayChange = (event: any) => {
    setEssay(event.target.value);
  };

  const handleFinishEssay = async () => {
    setLoading(true);
    await dispatch(
      createFeedback({
        essay_text: essay,
        essay_question: essay_question,
      })
    );
    setLoading(false);
  };

  const handleStartTimer = async () => {
    // handle start timer
  };

  return (
    <div className="flex flex-col gap-10 items-center w-full py-10 px-10">
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

        {essay_question && (
          <Button onClick={handleStartTimer} disabled={loading}>
            Start Timer
          </Button>
        )}

        <Button onClick={handleFinishEssay} disabled={loading}>
          Give Feedback
        </Button>
      </div>

      <Card className="w-1/2 h-20 p-4">
        {!essay_question && `Question about essay`}
        {loading ? "Loading..." : essay_question}
      </Card>

      <Textarea
        value={essay}
        onChange={(e) => handleEssayChange(e)}
        className="w-1/2 h-96"
        placeholder="Type your essay here."
      />

      {essay_feedback && (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Show Feedback</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            {essay_feedback}
            <DialogFooter>
              <Button type="submit">Save My Essay and Feedback</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
