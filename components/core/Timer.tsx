"use client";

import { RootState } from "@/redux-store/store";
import { useSelector } from "react-redux";

export const Timer = () => {
  const { essayInfo } = useSelector((state: RootState) => state.essayStore);

  const handleStartTimer = async () => {
    // handle start timer
  };

  const handleFinishSession = async () => {
    // stop timer
  };

  return <div> {essayInfo.essay_question && "Timer..."} </div>;
};
