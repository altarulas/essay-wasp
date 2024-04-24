"use client";

import { useSelector } from "react-redux";
import { Card } from "../ui/card";
import { RootState } from "@/redux-store/store";

export const Question = () => {
  const { tempEssayInfo } = useSelector((state: RootState) => state.essayStore);

  return (
    <Card className="w-1/2 h-20 p-4">
      {tempEssayInfo.essay_question
        ? tempEssayInfo.essay_question
        : `Question about essay`}
    </Card>
  );
};
