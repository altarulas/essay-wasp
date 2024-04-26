"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux-store/store";
import Image from "next/image";
import { getUserInfoStore } from "@/redux-store/features/userInfoStore";
import { useEffect } from "react";

export const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, credits, subscription_info } = useSelector(
    (state: RootState) => state.userInfoStore
  );

  const handleFetchInitialData = async () => {
    await dispatch(getUserInfoStore());
  };

  useEffect(() => {
    handleFetchInitialData();
  }, []);

  return (
    <Card className="p-10 h-[500px] w-[750px] flex flex-col justify-between">
      <Image
        className="rounded-full"
        width={40}
        height={40}
        src={user.avatar_url}
        alt="avatar"
      />

      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-10">
          <span> Email Address </span>
          <Input className="w-fit" placeholder={user.email_address} disabled />
        </div>
        <div className="flex items-center gap-[72px]">
          <span> Full Name </span>
          <Input className="w-fit" placeholder={user.full_name} disabled />
        </div>
      </div>

      <div className="flex items-center gap-10">
        <span>Remain Credits</span>
        <Button variant="default"> {credits} </Button>
      </div>

      {subscription_info.status && (
        <>
          <div className="flex items-center gap-10">
            <span>Sub status</span>
            <Button variant="default"> {subscription_info.status} </Button>
          </div>

          <div className="flex items-center gap-10">
            <span>Sub type</span>
            <Button variant="default">
              {subscription_info.subscription_type}
            </Button>
          </div>
        </>
      )}

      <div className="flex gap-10 w-full justify-end">
        <Button variant="destructive">Delete My Account</Button>
      </div>
    </Card>
  );
};
