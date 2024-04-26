"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEssayStore } from "@/redux-store/features/essayStore";
import { getUserInfoStore } from "@/redux-store/features/userInfoStore";
import { AppDispatch, RootState } from "@/redux-store/store";
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
    <div className="flex flex-col gap-10 items-center w-full py-10 px-10">
      {loading ? <Skeleton className="w-2/3 h-10" /> : <Menu />}

      {loading ? <Skeleton className="w-2/3 h-20" /> : <Question />}

      {loading ? <Skeleton className="w-2/3 h-[500px]" /> : <Text />}

      <Feedback />
    </div>
  );
};
