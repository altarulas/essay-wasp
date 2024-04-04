import { Logout } from "../components/Logout";

const AppScreenPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col gap-10 items-center">
        <h1 className="bg-zinc-500 rounded-2xl p-4">
          Welcome to App, glad you logged in
        </h1>
        <Logout />
      </div>
    </div>
  );
};

export default AppScreenPage;
