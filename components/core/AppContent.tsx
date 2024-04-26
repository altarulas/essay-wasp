"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEssayStore } from "@/redux-store/features/essayStore";
import { getUserInfoStore } from "@/redux-store/features/userInfoStore";
import { AppDispatch, RootState } from "@/redux-store/store";
import { Menu } from "./Menu";
import { Text } from "./Text";
import { Feedback } from "./Feedback";
import { Question } from "./Question";

export const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tempEssayInfo, loadingStates } = useSelector(
    (state: RootState) => state.essayStore
  );

  const handleFetchInitialData = async () => {
    await dispatch(getUserInfoStore());
    await dispatch(getEssayStore());
  };

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  return (
    <div className="flex flex-col gap-10 items-center w-full py-10 px-10">
      <Menu />

      <Question />

      <Text />

      <Feedback />
    </div>
  );
};
