import { Navbar } from "@/components/core/Navbar";
import { Settings } from "@/components/core/Settings";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

const SettingsPage = () => {
  return (
    <div className="w-screen h-screen">
      <Navbar />
      <div className="h-3/4 flex justify-center ">
        <div className="flex flex-col justify-center items-start gap-10">
          <Link className="font-bold text-3xl text-white" href="/">
            <Button variant="default" size="icon">
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
