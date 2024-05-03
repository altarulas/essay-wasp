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
import { Button } from "../../ui/button";
import {
  createFeedback,
  finishSession,
  createEssaySession,
  startSession,
  setShowFeedbackDialog,
  resetSessionInfo,
} from "@/redux-store/features/essayStore";
import { LoadingDialog } from "../LoadingDialog/LoadingDialog";
import { RiRefreshLine } from "react-icons/ri";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Menu = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { tempEssayInfo, sessionConditions } = useSelector(
    (state: RootState) => state.essayStore
  );

  const handleSelectChange = (value: string) => {
    setSelectedTopic(value);
  };

  const handleResetSession = async () => {
    setLoading(true);
    await dispatch(resetSessionInfo());
    setLoading(false);
  };

  const handleCreateTopic = async () => {
    await dispatch(createEssaySession(selectedTopic));
  };

  const handleGiveFeedback = async () => {
    dispatch(setShowFeedbackDialog(true));
    await dispatch(createFeedback());
  };

  const handleFinishSession = async () => {
    dispatch(finishSession());
  };

  const handleStartSession = () => {
    dispatch(startSession());
  };

  const isFeedbackAvailable = (): boolean => {
    if (
      !sessionConditions.is_session_finished ||
      !tempEssayInfo.essay_text ||
      !!tempEssayInfo.essay_feedback
    ) {
      return true;
    } else return false;
  };

  const isStartSessionAvailable = () => {
    if (sessionConditions.is_timer_running) {
      return true;
    }

    if (
      (!sessionConditions.is_session_started &&
        !tempEssayInfo.essay_question) ||
      sessionConditions.is_session_finished ||
      !!tempEssayInfo.essay_feedback
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="w-full h-[10%] gap-10 flex justify-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleResetSession}>
              <RiRefreshLine className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Reset Session</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Select
        disabled={
          sessionConditions.is_timer_running || !!tempEssayInfo.essay_text
        }
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

      <Button
        disabled={
          sessionConditions.is_timer_running || !!tempEssayInfo.essay_question
        }
        onClick={handleCreateTopic}
      >
        Create Topic
      </Button>

      <Button disabled={isStartSessionAvailable()} onClick={handleStartSession}>
        Start Session
      </Button>

      <Button
        disabled={!sessionConditions.is_timer_running}
        onClick={handleFinishSession}
      >
        Finish Session
      </Button>

      <Button disabled={isFeedbackAvailable()} onClick={handleGiveFeedback}>
        Give Feedback
      </Button>

      <LoadingDialog open={loading} />
    </div>
  );
};
