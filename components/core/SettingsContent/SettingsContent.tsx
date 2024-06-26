"use client";

import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter } from "../../ui/card";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux-store/store";
import { getUserInfoStore } from "@/redux-store/features/userInfoStore";
import { useEffect } from "react";
import Link from "next/link";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "@/lib/utils";
import styles from "./SettingsContent.module.scss";
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
import { PremiumDialog } from "../PremiumDialog/PremiumDialog";

export const SettingsContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, isLoadingUserInfo } = useSelector(
    (state: RootState) => state.userInfoStore
  );

  const handleFetchInitialData = async () => {
    await dispatch(getUserInfoStore());
  };

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  return (
    <Card className={cn(styles.container)}>
      {isLoadingUserInfo ? (
        <div className={styles.loadingWrapper}>
          <Skeleton className={styles.loading} />
          <Skeleton className={styles.loading} />
          <Skeleton className={styles.loading} />
          <Skeleton className={styles.loading} />
        </div>
      ) : (
        <>
          <CardContent className={styles.cardContentWrapper}>
            <div className={styles.content}>
              {!user.subscription_info.status && (
                <div className="flex items-center gap-[32px]">
                  <span>Remain Credits</span>
                  <Button disabled variant="outline">
                    {user.credits}
                  </Button>
                </div>
              )}

              {user.subscription_info.status ? (
                <div className="flex items-center gap-8">
                  <div className="mr-6">Subscription</div>

                  <Button variant="premium">{"PREMIUM"}</Button>
                  <Button variant="default">{"MONTHLY"}</Button>

                  <CancelPremium />
                </div>
              ) : (
                <div className={styles.subscription}>
                  <div className="mr-6">Subscription</div>
                  <Button disabled variant="default">
                    {"FREE"}
                  </Button>

                  <PremiumDialog />
                </div>
              )}
              <div className="flex items-center gap-10">
                <span> Email Address </span>
                <Input
                  className="w-fit"
                  placeholder={user.email_address}
                  disabled
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex w-full justify-end">
            <Link target="_blank" href="https://altarulas.com">
              <Button className="rounded-sm h-8">Contact Creator</Button>
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

const CancelPremium = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive">Cancel Subscription</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>About Canceling Premium</AlertDialogTitle>
          <AlertDialogDescription>
            {`We are using Buy Me Coffee as a payment method. To
        cancel subscription, you should cancel your membership
        on Buy Me Coffee. Click "Go to Buy Me Coffee" button and login Buy Me Coffee with email that you used to buy premium. After that you can cancel your membership on My account --> Payments section.`}

            <div className="w-full flex justify-center items-center py-4">
              <Image
                className="rounded-2xl"
                src="/cancel.png"
                height={300}
                width={250}
                alt="cancel"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Link
            target="_blank"
            href="https://studio.buymeacoffee.com/my-account/payments/memberships"
          >
            <AlertDialogAction>Go to Buy Me Coffee</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
