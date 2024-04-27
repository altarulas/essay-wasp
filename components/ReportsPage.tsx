import Link from "next/link";
import { Button } from "./ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { Reports } from "./core/ReportsContent";

const ReportsPage = () => {
  return (
    <div className="w-screen h-screen">
      <div className="h-full w-full flex justify-center items-center">
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
