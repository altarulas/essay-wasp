"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

export const Settings = () => {
  const { email_address, full_name, avatar_url } = useSelector(
    (state: RootState) => state.userInfo
  );

  return (
    <Card className="p-10 h-[500px] w-[750px] flex flex-col justify-between">
      <Image
        className="rounded-full"
        width={40}
        height={40}
        src={avatar_url}
        alt="avatar"
      />

      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-10">
          <span> Email Address </span>
          <Input className="w-fit" placeholder={email_address} disabled />
        </div>
        <div className="flex items-center gap-[72px]">
          <span> Full Name </span>
          <Input className="w-fit" placeholder={full_name} disabled />
        </div>
      </div>

      <div className="flex items-center gap-10">
        <span>Remain Credits</span>
        <Button variant="default">100</Button>
      </div>

      <div className="flex gap-10 w-full justify-end">
        <Button variant="destructive">Delete My Account</Button>
      </div>
    </Card>
  );
};
