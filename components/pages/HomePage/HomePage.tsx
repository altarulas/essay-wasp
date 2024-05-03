import { Login } from "@/components/core/Login/Login";

const HomePage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center gap-10">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Welcome to Natural Lang
        </h1>
        <Login />
      </div>
    </div>
  );
};

export default HomePage;
