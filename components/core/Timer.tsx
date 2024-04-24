"use client";

import { RootState } from "@/redux-store/store";
import { useSelector } from "react-redux";

export const Timer = () => {
  const { tempEssayInfo } = useSelector((state: RootState) => state.essayStore);

  const handleStartTimer = async () => {
    // handle start timer
  };

  const handleFinishSession = async () => {
    // stop timer
  };

  return <div> {tempEssayInfo.essay_question && "Timer..."} </div>;
};
