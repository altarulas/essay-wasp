"use client";

import { Logout } from "./Logout";
import { useRouter } from "next/navigation";
import { CiLight } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export const Navbar = () => {
  const router = useRouter();

  const { is_timer_running, is_session_finished } = useSelector(
    (state: RootState) => state.essayStore
  );

  const { status, subscription_type } = useSelector(
    (state: RootState) => state.userInfoStore.subscription_info
  );

  const { credits } = useSelector((state: RootState) => state.userInfoStore);

  const { setTheme, theme } = useTheme();

  const navigateSettings = () => {
    router.push("/settings");
  };

  const [remainingTime, setRemainingTime] = useState<number>(0);

  useEffect(() => {
    if (is_timer_running) {
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
  }, [is_timer_running]);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full flex justify-between items-center px-10 py-6">
      <div>
        <h2 className="scroll-m-20 bg-background text-foreground pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Natural Lang
        </h2>
      </div>

      <div>{is_timer_running && formatTime(remainingTime)}</div>

      <div className="flex items-center gap-4">
        {!status && (
          <>
            <Button>Remain Credits: {credits} </Button>

            <Link
              target="_blank"
              href="https://buymeacoffee.com/natural.lang/membership"
            >
              <Button variant="destructive">Use Unlimited</Button>
            </Link>
          </>
        )}

        <CiLight
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-6 w-6 cursor-pointer"
        />

        <IoSettingsOutline
          onClick={navigateSettings}
          className="h-5 w-5 cursor-pointer"
        />

        <Logout />
      </div>
    </div>
  );
};
