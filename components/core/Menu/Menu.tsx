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
  createQuestion,
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Menu = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { tempEssayInfo, sessionConditions } = useSelector(
    (state: RootState) => state.essayStore
  );

  const { subscription_info } = useSelector(
    (state: RootState) => state.userInfoStore.user
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
    await dispatch(createQuestion(selectedTopic));
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

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={
                sessionConditions.is_timer_running ||
                !!tempEssayInfo.essay_question
              }
              variant="ghost"
              onClick={handleCreateTopic}
            >
              Create Topic
            </Button>
          </TooltipTrigger>
          {!subscription_info.status && (
            <TooltipContent>{<p>Cost 5 Credits</p>}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={isStartSessionAvailable()} variant="ghost">
            Start Session
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogDescription className="text-sm">
              Do you wanna start the session? When you click start session, 40
              minutes countdown will be started.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogCancel asChild>
              <Button
                className="bg-black text-white hover:bg-black/80 hover:text-white"
                disabled={isStartSessionAvailable()}
                onClick={handleStartSession}
              >
                Start Session
              </Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        variant="ghost"
        disabled={!sessionConditions.is_timer_running}
        onClick={handleFinishSession}
      >
        Finish Session
      </Button>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              disabled={isFeedbackAvailable()}
              onClick={handleGiveFeedback}
            >
              Give Feedback
            </Button>
          </TooltipTrigger>
          {!subscription_info.status && (
            <TooltipContent>{<p>Cost 10 Credits</p>}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <LoadingDialog open={loading} />
    </div>
  );
};
