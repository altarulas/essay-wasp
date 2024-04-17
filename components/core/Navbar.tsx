"use client";

import { Logout } from "./Logout";
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

        <Logout />
      </div>
    </div>
  );
};
