"use client";

import { Logout } from "../Logout/Logout";
import { IoSettingsOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { RootState } from "@/redux-store/store";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Skeleton } from "../../ui/skeleton";
import styles from "./Navbar.module.scss";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Lottie from "lottie-react";
import WaspAnimation from "@/utils/WaspAnimation.json";
import { PremiumDialog } from "../PremiumDialog/PremiumDialog";
import { Tutorial } from "../Tutorial/Tutorial";
import { Counter } from "../Counter/Counter";

export const Navbar = () => {
  const { status } = useSelector(
    (state: RootState) => state.userInfoStore.user.subscription_info
  );

  const { user, isLoadingUserInfo } = useSelector(
    (state: RootState) => state.userInfoStore
  );

  return (
    <div className={styles.container}>
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>
          Essay Wasp
          <div className="w-16 h-16">
            <Lottie animationData={WaspAnimation} loop={true} />
          </div>
        </div>
        <Counter />
      </div>

      <div className={styles.menuWrapper}>
        <Tutorial />

        <div className={styles.creditWrapper}>
          {!status ? (
            isLoadingUserInfo ? (
              <Skeleton className="w-60 h-10" />
            ) : (
              <>
                <Button variant="secondary" className={styles.credit}>
                  Credits: {user.credits}
                </Button>

                <PremiumDialog />
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
