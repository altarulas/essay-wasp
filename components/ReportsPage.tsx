import Link from "next/link";
import { Navbar } from "./core/Navbar";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { Reports } from "./core/ReportsContent";

const ReportsPage = () => {
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
          <Reports />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
