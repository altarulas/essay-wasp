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
      data-testid="login-button"
      onClick={handleGoogleLogin}
      className="rounded-md flex gap-2 bg-zinc-950 w-48"
    >
      <Google
        data-testid="google-icon"
        className="w-6 h-6 flex justify-center items-center"
      />
      <span>Sign in with Google</span>
    </Button>
  );
};
