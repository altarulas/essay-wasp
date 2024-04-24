"use client";

import { useEffect } from "react";
import { Card, CardContent } from "../ui/card";
import { getUserSavedEssay } from "@/redux-store/features/essayStore";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import { Report } from "./Report";

export const Reports = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { savedEssayInfo } = useSelector(
    (state: RootState) => state.essayStore
  );

  const handleFetchInitialData = async () => {
    await dispatch(getUserSavedEssay());
  };

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  return (
    <Card className="p-10 h-[500px] w-[750px] flex flex-col justify-between">
      <CardContent className="flex flex-col items-start overflow-y-auto gap-8">
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
    </Card>
  );
};
