"use client";

import { useSelector } from "react-redux";
import { Card } from "../ui/card";
import { RootState } from "@/redux-store/store";
import { Skeleton } from "../ui/skeleton";

export const Question = () => {
  const { tempEssayInfo, loadingStates } = useSelector(
    (state: RootState) => state.essayStore
  );

  return (
    <Card className="w-1/2 h-24 p-4 text-sm text-gray-500">
      {loadingStates.isQuestionLoading ? (
        <div className="w-full h-full flex flex-col space-y-2 items-center">
          <Skeleton className="h-1/2 w-full" />
          <Skeleton className="h-1/2 w-full" />
        </div>
      ) : tempEssayInfo.essay_question ? (
        tempEssayInfo.essay_question
      ) : (
        `Generate an essay topic`
      )}
    </Card>
  );
};
