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
import { Button } from "../../ui/button";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteAllTempEssayInfo,
  postSaveSession,
  resetState,
  saveAllEssayInfo,
  setShowFeedbackDialog,
} from "@/redux-store/features/essayStore";
import { Skeleton } from "../../ui/skeleton";
import { Loader2 } from "lucide-react";
import styles from "./Feedback.module.scss";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const Feedback = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tempEssayInfo, loadingStates, operationCosts } = useSelector(
    (state: RootState) => state.essayStore
  );

  const { credits, subscription_info } = useSelector(
    (state: RootState) => state.userInfoStore.user
  );

  if (credits! < operationCosts.create_feedback_cost!) {
    return;
  }

  const handleSaveSession = async () => {
    dispatch(setShowFeedbackDialog(false));
    await dispatch(saveAllEssayInfo());
    await dispatch(deleteAllTempEssayInfo());
    dispatch(resetState());
    dispatch(postSaveSession());
  };

  const handleResetSession = async () => {
    dispatch(setShowFeedbackDialog(false));
    await dispatch(deleteAllTempEssayInfo());
    dispatch(resetState());
    dispatch(postSaveSession());
  };

  const isSessionSaveable = (): boolean => {
    if (
      tempEssayInfo.essay_feedback &&
      tempEssayInfo.essay_text &&
      tempEssayInfo.essay_question
    ) {
      return false;
    } else if (loadingStates.isSavingAllEssayInfo) {
      return false;
    } else return true;
  };

  const isSessionResettable = (): boolean => {
    if (
      tempEssayInfo.essay_feedback &&
      tempEssayInfo.essay_text &&
      tempEssayInfo.essay_question
    ) {
      return false;
    } else if (loadingStates.isDeletingAllEssayInfo) {
      return false;
    } else return true;
  };

  return (
    <Dialog
      onOpenChange={(value) => dispatch(setShowFeedbackDialog(value))}
      open={loadingStates.isDialogOpen}
    >
      {tempEssayInfo.essay_feedback && (
        <DialogTrigger
          onClick={() => dispatch(setShowFeedbackDialog(true))}
          asChild
        >
          <Button variant="outline">Show Feedback</Button>
        </DialogTrigger>
      )}

      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            Essay Feedback
          </DialogTitle>
          <DialogDescription className="whitespace-pre-wrap p-4">
            {loadingStates.isFeedbackLoading ? (
              <div className="space-y-4">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-20" />
                <Skeleton className="w-full h-32" />
                <Skeleton className="w-full h-36" />
              </div>
            ) : (
              tempEssayInfo.essay_feedback
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="py-4 gap-4">
          <Button
            disabled={isSessionResettable()}
            onClick={() => {
              handleResetSession();
            }}
            type="submit"
          >
            Reset This Session
            {loadingStates.isDeletingAllEssayInfo && (
              <Loader2 className={styles.loading} />
            )}
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  disabled={isSessionSaveable()}
                  onClick={() => {
                    handleSaveSession();
                  }}
                  type="submit"
                >
                  Save This Session
                  {loadingStates.isSavingAllEssayInfo && (
                    <Loader2 className={styles.loading} />
                  )}
                </Button>
              </TooltipTrigger>
              {!subscription_info.status && (
                <TooltipContent>{<p>Cost 10 Credits</p>}</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
