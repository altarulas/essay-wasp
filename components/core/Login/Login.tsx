"use client";

import { supabaseClient } from "@/utils/supabase/client";
import { Button } from "../../ui/button";
import { Google } from "@/components/pages/HomePage/GoogleIcon";

export const Login = () => {
  const handleGoogleLogin = async () => {
    const supabase = supabaseClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="rounded-md flex gap-2 bg-zinc-950"
    >
      <Google className="w-6 h-6" />
      <span>Sing in with Google</span>
    </Button>
  );
};
