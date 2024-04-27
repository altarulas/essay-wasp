"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getEssayStore } from "@/redux-store/features/essayStore";
import { getUserInfoStore } from "@/redux-store/features/userInfoStore";
import { AppDispatch } from "@/redux-store/store";
import { Menu } from "./Menu";
import { Text } from "./Text";
import { Feedback } from "./Feedback";
import { Question } from "./Question";
import { Skeleton } from "../ui/skeleton";

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
    <div className="w-full h-4/5 flex flex-col justify-center items-center gap-8">
      {loading ? <Skeleton className="w-1/2 h-[10%]" /> : <Menu />}

      {loading ? <Skeleton className="w-1/2 h-1/5" /> : <Question />}

      {loading ? <Skeleton className="w-1/2 h-[70%]" /> : <Text />}

      <Feedback />
    </div>
  );
};
