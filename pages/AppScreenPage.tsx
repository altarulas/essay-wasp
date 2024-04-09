import { Logout } from "@/components/core/Logout";

const AppScreenPage = () => {
  return (
    <div className="w-screen h-screen">
      <div className="w-full h-16 bg-zinc-700 flex justify-between items-center px-10 py-6">
        <div>
          <h2 className="scroll-m-20 text-white pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Natural Lang
          </h2>
        </div>
        <div>
          <Logout />
        </div>
      </div>
    </div>
  );
};

export default AppScreenPage;
