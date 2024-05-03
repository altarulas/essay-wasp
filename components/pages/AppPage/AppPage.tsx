import { AppContent } from "@/components/core/AppContent/AppContent";
import { Navbar } from "@/components/core/Navbar/Navbar";

const AppPage = () => {
  return (
    <div className="w-screen h-screen overflow-y-auto">
      <div className="h-[10%] w-full">
        <Navbar />
      </div>
      <div className="w-full h-[90%] flex justify-center items-center">
        <AppContent />
      </div>
    </div>
  );
};

export default AppPage;
