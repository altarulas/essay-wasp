"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSession,
  getUserTempEssay,
} from "@/redux-store/features/essayStore";
import { getUserInfo } from "@/redux-store/features/userInfoStore";
import { AppDispatch, RootState } from "@/redux-store/store";
import { Menu } from "./Menu";
import { Text } from "./Text";
import { Feedback } from "./Feedback";
import { Question } from "./Question";

export const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tempEssayInfo } = useSelector((state: RootState) => state.essayStore);

  const handleFetchInitialData = async () => {
    await dispatch(getSession());
    await dispatch(getUserInfo());
    await dispatch(getUserTempEssay());
  };

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center w-full py-10 px-10">
      <Menu />

      <Question />

      <Text />

      {tempEssayInfo.essay_feedback && <Feedback />}
    </div>
  );
};
