"use client";

import { Logout } from "./Logout";
import { CiLight } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useTheme } from "next-themes";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/store";
import { Button } from "../ui/button";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const { setTheme, theme } = useTheme();

  const { status } = useSelector(
    (state: RootState) => state.userInfoStore.user.subscription_info
  );

  const { user, isLoadingInfoStore } = useSelector(
    (state: RootState) => state.userInfoStore
  );

  const { sessionConditions } = useSelector(
    (state: RootState) => state.essayStore
  );

  const [remainingTime, setRemainingTime] = useState<number>(0);

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
            setRemainingTime(Math.floor(timeDifference / 1000)); // Convert milliseconds to seconds
          } else {
            setRemainingTime(0);
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

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-full flex justify-between items-center px-10 py-6">
      <div className="flex justify-center items-center gap-10">
        <div className="scroll-m-20 bg-background text-foreground pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Natural Lang
        </div>
        {sessionConditions.show_timer && (
          <div className="text-2xl bg-zinc-900 rounded-lg py-1 w-36 flex items-center justify-center">
            {formatTime(remainingTime)}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 mr-10">
          {!status &&
            (isLoadingInfoStore ? (
              <Skeleton className="w-72 h-10" />
            ) : (
              <>
                <Button>Credits: {user.credits} </Button>

                <Link
                  target="_blank"
                  href="https://buymeacoffee.com/natural.lang/membership"
                >
                  <Button variant="destructive">Use Unlimited</Button>
                </Link>
              </>
            ))}
        </div>

        <Link href="/reports">
          <Button>My Reports</Button>
        </Link>

        <CiLight
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-6 w-6 cursor-pointer"
        />

        <Link href="/settings">
          <IoSettingsOutline className="h-5 w-5 cursor-pointer" />
        </Link>

        <Logout />
      </div>
    </div>
  );
};
