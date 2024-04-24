"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  createFeedback,
  deleteAllTempEssayInfo,
  finishSession,
  resetState,
  saveEssayInfo,
  saveEssayText,
  startEssaySession,
  startSession,
} from "@/redux-store/features/essayStore";

export const Menu = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedTopic, setSelectedTopic] = useState<string>("");

  const { tempEssayInfo, is_timer_running, is_session_finished } = useSelector(
    (state: RootState) => state.essayStore
  );

  const handleSelectChange = (value: string) => {
    setSelectedTopic(value);
  };

  const handleCreateTopic = async () => {
    dispatch(resetState());
    await dispatch(startEssaySession(selectedTopic));
  };

  const handleGiveFeedback = async () => {
    await dispatch(createFeedback());
  };

  const handleFinishSession = async () => {
    dispatch(finishSession());
  };

  const handleStartSession = () => {
    dispatch(startSession());
  };

  const isSessionSaveable = (): boolean => {
    if (
      tempEssayInfo.essay_feedback &&
      tempEssayInfo.essay_text &&
      tempEssayInfo.essay_question
    ) {
      return true;
    } else return false;
  };

  const handleSaveSession = async () => {
    await dispatch(saveEssayInfo());
    await dispatch(deleteAllTempEssayInfo());
    dispatch(resetState());
  };

  return (
    <div className="w-full gap-10 flex justify-center">
      <Select
        disabled={is_timer_running}
        onValueChange={(value) => handleSelectChange(value)}
      >
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

      <Button disabled={is_timer_running} onClick={handleCreateTopic}>
        Create Topic
      </Button>

      <Button
        disabled={
          !tempEssayInfo.essay_question ||
          is_timer_running ||
          is_session_finished
        }
        onClick={handleStartSession}
      >
        Start Session
      </Button>

      <Button disabled={!is_timer_running} onClick={handleFinishSession}>
        Finish Session
      </Button>

      <Button
        disabled={!is_session_finished || !tempEssayInfo.essay_text}
        onClick={handleGiveFeedback}
      >
        Give Feedback
      </Button>

      <Button disabled={!isSessionSaveable()} onClick={handleSaveSession}>
        Save Session
      </Button>
    </div>
  );
};
