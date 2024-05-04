"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../ui/card";
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
    <Card className={cn(styles.container)}>
      {loadingStates.isSavedSessionLoading ? (
        <div className={styles.loadingWrapper}>
          <Skeleton className={styles.loading} />
          <Skeleton className={styles.loading} />
          <Skeleton className={styles.loading} />
          <Skeleton className={styles.loading} />
          <Skeleton className={styles.loading} />
        </div>
      ) : savedEssayInfo.length > 0 ? (
        <>
          <CardHeader className={styles.title}>Reports Detail</CardHeader>
          <CardContent className={styles.content}>
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
        </>
      ) : (
        <div className={styles.emptyInfoWrapper}>
          <span className="text-lg">You have no reports currently</span>
        </div>
      )}
    </Card>
  );
};
