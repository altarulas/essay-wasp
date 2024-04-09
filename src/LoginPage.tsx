"use client";

import { supabaseClient } from "@/utils/supabase/client";

export const LoginPage = () => {
  const handleGoogleLogin = async () => {
    const supabase = supabaseClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        /* queryParams: {
          access_type: "offline",
          prompt: "consent",
        }, */
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col w-96 h-48 rounded-lg p-4 gap-10 bg-zinc-700">
        <h1 className="text-white p-4 text-center text-lg">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="text-white bg-blue-400 rounded-2xl p-4"
        >
          Google Login
        </button>
      </div>
    </div>
  );
};
