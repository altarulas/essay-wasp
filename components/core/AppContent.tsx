"use client";

import { Card } from "../ui/card";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserTempEssay } from "@/redux-store/features/essayStore";
import { getUserInfo } from "@/redux-store/features/userInfoStore";
import { AppDispatch, RootState } from "@/redux-store/store";
import { Menu } from "./Menu";
import { EssayText } from "./EssayText";
import { Feedback } from "./Feedback";

export const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tempEssayInfo } = useSelector((state: RootState) => state.essayStore);

  const handleFetchInitialData = async () => {
    await dispatch(getUserInfo());
    await dispatch(getUserTempEssay());
  };

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center w-full py-10 px-10">
      <Menu />

      <Card className="w-1/2 h-20 p-4">
        {tempEssayInfo.essay_question
          ? tempEssayInfo.essay_question
          : `Question about essay`}
      </Card>

      <EssayText />

      {tempEssayInfo.essay_feedback && <Feedback />}
    </div>
  );
};
