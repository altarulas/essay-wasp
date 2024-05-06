"use client";

import { Logout } from "../Logout/Logout";
import { IoSettingsOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux-store/store";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Skeleton } from "../../ui/skeleton";
import { useEffect, useState } from "react";
import { finishSession, saveLeftTime } from "@/redux-store/features/essayStore";
import styles from "./Navbar.module.scss";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { toast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Lottie from "lottie-react";
import WaspAnimation from "@/utils/WaspAnimation.json";

export const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();

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

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    if (minutes === 0 && seconds === 1) {
      dispatch(saveLeftTime("00:00:00"));
      dispatch(finishSession());
      toast({ title: "Your time has finished", variant: "destructive" });
      return;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>
          Essay Wasp
          <div className="w-16 h-16">
            <Lottie animationData={WaspAnimation} loop={true} />
          </div>
        </div>
        {isFormattedTimeAvailable() && (
          <div className={styles.time}>{formatTime(time)}</div>
        )}

        {isRemainingTimeAvailable() && (
          <div className={styles.time}>{remainingTime}</div>
        )}
      </div>

      <div className={styles.menuWrapper}>
        <div className={styles.creditWrapper}>
          {!status ? (
            isLoadingInfoStore ? (
              <Skeleton className="w-60 h-10" />
            ) : (
              <>
                <span className={styles.credit}>credits: {user.credits}</span>

                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button className={styles.button}>Use Unlimited</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>About Premium Usage</AlertDialogTitle>
                      <AlertDialogDescription className="text-[10px]">
                        We are using Buy Me Coffee as a payment method. To
                        understand your sales purchase, enter the e-mail address
                        of your gmail account that you registered with Natural
                        Lang. By doing this, you are creating a Buy Me Coffee
                        account with that e-mail. In Buy Me Coffee, you will be
                        able to manage all subscription operations.
                      </AlertDialogDescription>
                      <AlertDialogTitle>Important!!!</AlertDialogTitle>
                      <AlertDialogDescription className="text-red-700 text-[10px] font-bold">
                        If you purchase a membership from Buy Me Coffee with a
                        different e-mail address than the e-mail address you
                        entered in Essay Wasp, you will not be able to get
                        premium rights and you will also waste your money.
                      </AlertDialogDescription>

                      <div className="w-full flex justify-center items-center py-2">
                        <Image
                          className="rounded-2xl"
                          src="/upgrade.png"
                          height={200}
                          width={250}
                          alt="upgrade"
                        />
                      </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <Link
                        target="_blank"
                        href="https://buymeacoffee.com/essaywasp/membership"
                      >
                        <AlertDialogAction>
                          Go to Buy Me Coffee
                        </AlertDialogAction>
                      </Link>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className={styles.button}>Premium</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You have unlimited credits!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <Link href="/reports">
          <Button variant="ghost" className="rounded-sm h-8 hover:bg-white">
            Reports
          </Button>
        </Link>

        <Link href="/settings">
          <IoSettingsOutline className={styles.settings} />
        </Link>

        <Logout />
      </div>
    </div>
  );
};
