import { Settings } from "@/components/core/SettingsContent/SettingsContent";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const SettingsPage = () => {
  return (
    <div className="w-screen h-screen">
      <div className="h-full w-full flex justify-center items-center ">
        <div className="h-2/3 w-1/2 flex flex-col justify-center items-start gap-10">
          <Link className="font-bold text-3xl" href="/">
            <Button
              className="bg-zinc-50 dark:bg-zinc-900"
              variant="outline"
              size="icon"
            >
              <FaArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
