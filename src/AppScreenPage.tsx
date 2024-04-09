"use client";

import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export const AppScreenPage = () => {
  const router = useRouter();
  const supabase = supabaseClient();
  const handleLogoutGoogle = async () => {
    const { error } = await supabase.auth.signOut();

    router.push("/");
  };

  /* console.log("user session: ", supabase.auth.getSession());
  console.log("get user: ", supabase.auth.getUser()); */
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-96 h-48 flex flex-col gap-10 p-4 bg-zinc-700 rounded-lg">
        <h1 className="text-white p-4 text-center text-lg">
          Welcome to Protected Rout!
        </h1>
        <button
          onClick={handleLogoutGoogle}
          className="w-full p-4 rounded-2xl bg-blue-400"
        >
          Click to logout
        </button>
      </div>
    </div>
  );
};
