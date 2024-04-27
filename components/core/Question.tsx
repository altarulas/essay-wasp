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
    <Card className="w-1/2 h-1/5 px-4 py-2 text-sm text-gray-500 flex justify-center items-center border-[2px]">
      {loadingStates.isQuestionLoading ? (
        <div className="w-full h-full flex flex-col space-y-2 items-center justify-center">
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
