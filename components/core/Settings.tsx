"use client";

import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "@/components/ui/input";

export const Settings = () => {
  return (
    <Card className="p-10 h-[500px] w-[750px] flex flex-col justify-between">
      <div className="flex flex-col gap-10">
        <div className="flex items-center gap-10">
          <span>Email Address</span>
          <Input className="w-fit" placeholder="test@gmail.com" disabled />
        </div>
        <div className="flex items-center gap-[72px]">
          <span>Full Name</span>
          <Input className="w-fit" placeholder="John Adam" disabled />
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
