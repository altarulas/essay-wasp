"use client";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux-store/store";
import Image from "next/image";
import { getUserInfoStore } from "@/redux-store/features/userInfoStore";
import { useEffect } from "react";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

export const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, credits, subscription_info, isUserInfoLoading } = useSelector(
    (state: RootState) => state.userInfoStore
  );

  const handleFetchInitialData = async () => {
    await dispatch(getUserInfoStore());
  };

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  return (
    <Card className="p-6 space-y-8 w-[750px] flex flex-col justify-between">
      {isUserInfoLoading ? (
        <div className="flex flex-row space-x-10">
          <Skeleton className="w-[350px] h-[450px]" />
          <div className="flex flex-col space-y-10 h-[400px] justify-center items-center">
            <Skeleton className="w-[350px] h-[150px]" />
            <Skeleton className="w-[350px] h-[90px]" />
            <Skeleton className="w-[350px] h-[60px]" />
            <Skeleton className="w-[350px] h-[30px]" />
          </div>
        </div>
      ) : (
        <>
          <CardTitle className="w-full p-6">My Profile</CardTitle>
          <div className="flex flex-row justify-between">
            <CardHeader className="w-fit flex flex-col items-start gap-10">
              <Image
                className="rounded-full"
                width={150}
                height={150}
                src={user.avatar_url}
                alt="avatar"
              />
            </CardHeader>

            <CardContent className="space-y-6">
              {subscription_info.status ? (
                <div className="flex items-center gap-8">
                  <div className="mr-6">Subscription</div>

                  <Button variant="default">{"PREMIUM"}</Button>
                  <Button variant="default">{"YEARLY"}</Button>
                </div>
              ) : (
                <div className="flex items-center gap-8">
                  <div className="mr-6">Subscription</div>
                  <Button disabled variant="default">
                    {"FREE"}
                  </Button>
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
              <div className="flex items-center gap-[70px]">
                <span> Full Name </span>
                <Input
                  className="w-fit"
                  placeholder={user.full_name}
                  disabled
                />
              </div>
              <div className="flex items-center gap-[32px]">
                <span>Remain Credits</span>
                <Button disabled variant="outline">
                  {credits}
                </Button>
              </div>
            </CardContent>
          </div>

          <CardFooter className="w-full flex justify-end gap-8">
            {subscription_info.status && (
              <Link
                target="_blank"
                href="https://studio.buymeacoffee.com/my-account/payments/memberships"
              >
                <Button variant="destructive">Cancel My Subscription</Button>
              </Link>
            )}
            <Button variant="destructive">Delete My Account</Button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
