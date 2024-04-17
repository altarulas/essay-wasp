"use client";

import Image from "next/image";
import { Logout } from "./Logout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { CiLight } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const router = useRouter();

  const { setTheme, theme } = useTheme();

  const navigateSettings = () => {
    router.push("/settings");
  };

  return (
    <div className="w-full flex justify-between items-center px-10 py-6">
      <div>
        <h2 className="scroll-m-20 bg-background text-foreground pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Natural Lang
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <CiLight
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-6 w-6 cursor-pointer"
        />

        <IoSettingsOutline
          onClick={navigateSettings}
          className="h-5 w-5 cursor-pointer"
        />

        <Popover>
          <PopoverTrigger>
            <Image
              className="rounded-full cursor-pointer"
              width={40}
              height={40}
              src={
                "https://lh3.googleusercontent.com/a/ACg8ocLxQhf0gYAd1PxT4WQoER1u0eJeTQlqUdLq3tW-5BJ6kDjvYA=s96-c"
              }
              alt="avatar"
            />
          </PopoverTrigger>
          <PopoverContent className="w-fit flex flex-col gap-4 px-0">
            <Logout />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
