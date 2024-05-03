"use client";

import { Logout } from "../Logout/Logout";
import { CiLight } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux-store/store";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Skeleton } from "../../ui/skeleton";
import { useEffect, useState } from "react";
import { saveLeftTime } from "@/redux-store/features/essayStore";
import styles from "./Navbar.module.scss";

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();

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

  const [time, setTime] = useState<number>(0);
  const [remainingTime, setRemainingTime] = useState<string | null>(null);

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
      const leftTime = formatTime(time);
      dispatch(saveLeftTime(leftTime));
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

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>Natural Lang</div>
        {(sessionConditions.show_timer || sessionConditions.is_timer_running) &&
          !sessionConditions.left_timer && (
            <div className={styles.time}>{formatTime(time)}</div>
          )}

        {sessionConditions.show_timer &&
          !sessionConditions.is_timer_running &&
          sessionConditions.left_timer && (
            <div className={styles.time}>{remainingTime}</div>
          )}
      </div>

      <div className={styles.menuWrapper}>
        <div className={styles.creditWrapper}>
          {!status &&
            (isLoadingInfoStore ? (
              <Skeleton className="w-60 h-10" />
            ) : (
              <>
                <span className="text-sm">credits: {user.credits}</span>

                <Link
                  target="_blank"
                  href="https://buymeacoffee.com/natural.lang/membership"
                >
                  <Button className={styles.button}>Go Premium</Button>
                </Link>
              </>
            ))}
        </div>

        <Link href="/reports">
          <Button className={styles.reports} variant="outline">
            Reports
          </Button>
        </Link>

        <CiLight
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className={styles.theme}
        />

        <Link href="/settings">
          <IoSettingsOutline className={styles.settings} />
        </Link>

        <Logout />
      </div>
    </div>
  );
};
