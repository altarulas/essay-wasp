import { Content } from "@/components/core/Content";
import { Navbar } from "@/components/core/Navbar";

const AppPage = () => {
  return (
    <div className="w-screen h-screen overflow-y-auto">
      <Navbar />
      <Content />
    </div>
  );
};

export default AppPage;
