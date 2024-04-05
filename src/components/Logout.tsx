"use client";

import { createClient } from "@/utils/supabase/client";

export const Logout = () => {
  const supabase = createClient();

  const handleGoogleLogout = () => {
    // handle google logout
  };

  console.log("supabase: ", supabase.auth.getUser());

  return (
    <div className="flex flex-col gap-10 items-center">
      <h1 className="bg-zinc-500 rounded-2xl p-4">
        Welcome to App, glad you logged in
      </h1>
      <div className="flex flex-col w-96 h-48 rounded-2xl p-4 gap-10 bg-blue-400">
        <h1 className="text-white p-4 text-center text-lg">Logout Form</h1>
        <button
          onClick={handleGoogleLogout}
          className="text-white bg-zinc-950 rounded-xl p-4"
        >
          Click to Logout
        </button>
      </div>
    </div>
  );
};
