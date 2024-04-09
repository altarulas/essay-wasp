"use client";

import Link from "next/link";

export const HomePage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-96 h-48 flex flex-col gap-10 p-4 bg-zinc-700 rounded-lg">
        <h1 className="text-white p-4 text-center text-lg">
          Welcome Home Page!
        </h1>
        <Link href="/login">
          <button className="w-full p-4 rounded-2xl bg-blue-400">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};
