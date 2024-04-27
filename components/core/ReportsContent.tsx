"use client";

import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { getUserSavedEssay } from "@/redux-store/features/essayStore";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import { Report } from "./Report";
import { Skeleton } from "../ui/skeleton";
import styles from "./ReportsContent.module.scss";

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
    <Card className="p-10 h-full w-full flex flex-col justify-between border-2">
      {loadingStates.isSavedSessionLoading ? (
        <div className="w-full h-full flex flex-col items-center space-y-6">
          <Skeleton className="w-full h-1/6" />
          <Skeleton className="w-full h-1/6" />
          <Skeleton className="w-full h-1/6" />
          <Skeleton className="w-full h-1/6" />
          <Skeleton className="w-full h-1/6" />
        </div>
      ) : (
        <CardContent className={styles.container}>
          {savedEssayInfo.map((essay, index) => (
            <Report
              key={String(essay.created_at)}
              createdAt={essay.created_at}
              essayQuestion={essay.essay_question}
              essayText={essay.essay_text}
              essayFeedback={essay.essay_feedback}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
};
