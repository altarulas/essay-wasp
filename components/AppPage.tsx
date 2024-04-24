import { AppContent } from "@/components/core/AppContent";
import { Navbar } from "@/components/core/Navbar";

const AppPage = () => {
  return (
    <div className="w-screen h-screen overflow-y-auto">
      <Navbar />
      <AppContent />
    </div>
  );
};

export default AppPage;
