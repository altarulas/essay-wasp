"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getEssayStore } from "@/redux-store/features/essayStore";
import { getUserInfoStore } from "@/redux-store/features/userInfoStore";
import { AppDispatch } from "@/redux-store/store";
import { Menu } from "../Menu/Menu";
import { Text } from "../Text/Text";
import { Feedback } from "../Feedback/Feedback";
import { Question } from "../Question/Question";
import { Skeleton } from "../../ui/skeleton";

// dummy text

export const AppContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState<boolean>(true);

  const handleFetchInitialData = async () => {
    setLoading(true);
    await dispatch(getUserInfoStore());
    await dispatch(getEssayStore());
    setLoading(false);
  };

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  return (
    <div className="w-full h-[90%] flex flex-col justify-center items-center gap-8">
      {loading ? <Skeleton className="w-1/2 h-[10%]" /> : <Menu />}

      {loading ? <Skeleton className="w-1/2 h-[15%]" /> : <Question />}

      {loading ? <Skeleton className="w-1/2 h-[75%]" /> : <Text />}

      <Feedback />

      <div className="flex justify-center items-center flex-col gap-1">
        <span className="text-[12px] text-gray-500">
          Essay Wasp is an experimental tool. Please do not completely trust AI
          results.
        </span>

        <span className="text-[12px] text-gray-500">Powered by GPT-4</span>
      </div>
    </div>
  );
};
