"use client";

import { toast } from "@/components/ui/use-toast";
import { finishSession, saveLeftTime } from "@/redux-store/features/essayStore";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const Counter = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { sessionConditions } = useSelector(
    (state: RootState) => state.essayStore
  );

  const [time, setTime] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

  const formatTime = (time: number, type?: string) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    if (minutes === 0 && seconds === 1) {
      dispatch(saveLeftTime("00:00:00"));
      dispatch(finishSession());
      toast({ title: "Your time has finished", variant: "destructive" });
      return;
    }

    if (type === "h") {
      return `${hours.toString().padStart(2, "0")}`;
    } else if (type === "m") {
      return `${minutes.toString().padStart(2, "0")}`;
    } else if (type === "s") {
      return `${seconds.toString().padStart(2, "0")}`;
    } else {
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  const getTimePart = (time: string | null, type: string) => {
    if (!time) return;

    const [hours, minutes, seconds] = time.split(":");
    switch (type) {
      case "h":
        return hours;
      case "m":
        return minutes;
      case "s":
        return seconds;
      default:
        return "";
    }
  };

  const isFormattedTimeAvailable = (): boolean => {
    return (
      (sessionConditions.show_timer || sessionConditions.is_timer_running) &&
      !sessionConditions.left_timer
    );
  };

  const isRemainingTimeAvailable = (): boolean => {
    return (
      sessionConditions.show_timer &&
      !sessionConditions.is_timer_running &&
      !!sessionConditions.left_timer
    );
  };

  useEffect(() => {
    if (sessionConditions.is_timer_running) {
      // Function to calculate remaining time
      const calculateRemainingTime = () => {
        const endTimeStr = localStorage.getItem("countdown_end_time");
        if (endTimeStr) {
          const endTime = parseInt(endTimeStr, 10);
          const currentTime = Date.now();
          const timeDifference = endTime - currentTime;
          if (timeDifference > 0) {
            setTime(Math.floor(timeDifference / 1000)); // Convert milliseconds to seconds
          } else {
            setTime(0);
          }
        }
      };

      // Call calculateRemainingTime initially
      calculateRemainingTime();

      // Interval to update remaining time every second
      const interval = setInterval(calculateRemainingTime, 1000);

      // Cleanup interval
      return () => clearInterval(interval);
    } else return;
  }, [sessionConditions.is_timer_running]);

  useEffect(() => {
    if (
      sessionConditions.is_session_finished &&
      sessionConditions.show_timer &&
      !sessionConditions.left_timer
    ) {
      const leftTime = formatTime(Number(time));
      leftTime && dispatch(saveLeftTime(leftTime));
    } else return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sessionConditions.is_session_finished,
    sessionConditions.show_timer,
    sessionConditions.left_timer,
  ]);

  useEffect(() => {
    if (sessionConditions.left_timer) {
      setRemainingTime(sessionConditions.left_timer);
    }
  }, [sessionConditions.left_timer]);

  return (
    <>
      {(isFormattedTimeAvailable() || isRemainingTimeAvailable()) && (
        <div className="flex justify-center items-center gap-1">
          <div className="bg-white text-xl font-semibold rounded-sm py-1 px-2 flex items-center justify-center text-zinc-800 shadow-2xl">
            {isFormattedTimeAvailable() && formatTime(time, "h")}
            {isRemainingTimeAvailable() && getTimePart(remainingTime, "h")}
          </div>
          {`:`}
          <div className="bg-white text-xl font-semibold rounded-sm py-1 px-2 flex items-center justify-center text-zinc-800 shadow-2xl">
            {isFormattedTimeAvailable() && formatTime(time, "m")}
            {isRemainingTimeAvailable() && getTimePart(remainingTime, "m")}
          </div>
          {`:`}
          <div className="bg-white text-xl font-semibold rounded-sm py-1 px-2 flex items-center justify-center text-zinc-800 shadow-2xl">
            {isFormattedTimeAvailable() && formatTime(time, "s")}
            {isRemainingTimeAvailable() && getTimePart(remainingTime, "s")}
          </div>
        </div>
      )}
    </>
  );
};
