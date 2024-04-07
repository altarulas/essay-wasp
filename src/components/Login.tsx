"use client";

import { createClient } from "@/utils/supabase/client";

export const Login = () => {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
          redirectTo: `${location.origin}/auth/callback`,
        },
      },
    });
  };

  return (
    <div className="flex flex-col w-96 h-48 rounded-2xl p-4 gap-10 bg-blue-400">
      <h1 className="text-white p-4 text-center text-lg">Login Form</h1>
      <button
        onClick={handleGoogleLogin}
        className="text-white bg-zinc-950 rounded-xl p-4"
      >
        Google Login
      </button>
    </div>
  );
};
