"use client";

import { useEffect } from "react";
import { Card, CardContent } from "../../ui/card";
import { getUserSavedEssay } from "@/redux-store/features/essayStore";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import { Report } from "../Report/Report";
import { Skeleton } from "../../ui/skeleton";
import styles from "./ReportsContent.module.scss";
import { cn } from "@/lib/utils";

export const Reports = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { savedEssayInfo, loadingStates } = useSelector(
    (state: RootState) => state.essayStore
  );

  const handleFetchInitialData = async () => {
    await dispatch(getUserSavedEssay());
  };

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  return (
    <Card className={cn(styles.container, "bg-zinc-50 dark:bg-zinc-900")}>
      {loadingStates.isSavedSessionLoading ? (
        <div className={styles.loadingWrapper}>
          <Skeleton className="w-full h-1/6" />
          <Skeleton className="w-full h-1/6" />
          <Skeleton className="w-full h-1/6" />
          <Skeleton className="w-full h-1/6" />
          <Skeleton className="w-full h-1/6" />
        </div>
      ) : savedEssayInfo.length > 0 ? (
        <CardContent className={styles.container}>
          {savedEssayInfo.map((essay, index) => (
            <Report
              key={String(essay.created_at)}
              leftTime={essay.left_time}
              createdAt={essay.created_at}
              essayQuestion={essay.essay_question}
              essayText={essay.essay_text}
              essayFeedback={essay.essay_feedback}
            />
          ))}
        </CardContent>
      ) : (
        <div className={styles.emptyInfoWrapper}>
          <span className="text-lg">You have no reports currently</span>
        </div>
      )}
    </Card>
  );
};
