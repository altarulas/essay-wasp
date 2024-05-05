"use client";

import { useSelector } from "react-redux";
import { Card } from "../../ui/card";
import { RootState } from "@/redux-store/store";
import { Skeleton } from "../../ui/skeleton";
import styles from "./Question.module.scss";
import { cn } from "@/lib/utils";

export const Question = () => {
  const { tempEssayInfo, loadingStates } = useSelector(
    (state: RootState) => state.essayStore
  );

  return (
    <Card className={cn(styles.container)}>
      {loadingStates.isQuestionLoading ? (
        <div className={styles.loadingWrapper}>
          <Skeleton className="h-1/3 w-full" />
          <Skeleton className="h-1/3 w-full" />
        </div>
      ) : tempEssayInfo.essay_question ? (
        tempEssayInfo.essay_question
      ) : (
        `Generate an essay topic`
      )}
    </Card>
  );
};
