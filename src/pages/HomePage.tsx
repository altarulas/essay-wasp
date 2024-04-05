import Link from "next/link";

const HomePage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="bg-emerald-400 w-96 h-48 rounded-2xl p-4 flex flex-col gap-10 items-center justify-center text-lg">
        Welcome to app login with google
        <Link href={"/login"}>
          <button className="bg-zinc-950 rounded-2xl p-4">
            go to login page
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
