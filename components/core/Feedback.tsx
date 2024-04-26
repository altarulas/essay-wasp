"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllTempEssayInfo,
  postSaveSession,
  resetState,
  saveEssayInfo,
  setShowFeedbackDialog,
} from "@/redux-store/features/essayStore";
import { Skeleton } from "../ui/skeleton";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";

export const Feedback = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const { tempEssayInfo, loadingStates } = useSelector(
    (state: RootState) => state.essayStore
  );

  const handleSaveSession = async () => {
    dispatch(setShowFeedbackDialog(false));
    await dispatch(saveEssayInfo());
    await dispatch(deleteAllTempEssayInfo());
    dispatch(resetState());
    dispatch(postSaveSession());

    toast({
      title: "Essay session is saved",
    });
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

  return (
    <Dialog
      onOpenChange={(value) => dispatch(setShowFeedbackDialog(value))}
      open={loadingStates.isDialogOpen}
    >
      <DialogTrigger
        onClick={() => dispatch(setShowFeedbackDialog(true))}
        asChild
      >
        <Button>Show Feedback</Button>
      </DialogTrigger>

      <DialogContent className="max-w-[700px] max-h-[750px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pb-8 w-full text-center">
            Essay Feedback
          </DialogTitle>
          <DialogDescription className="whitespace-pre-wrap rounded-2xl p-4">
            {loadingStates.isFeedbackLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-40" />
              </div>
            ) : (
              tempEssayInfo.essay_feedback
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="py-4">
          <Button
            disabled={!isSessionSaveable()}
            onClick={() => {
              handleSaveSession();
            }}
            type="submit"
          >
            Save This Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
