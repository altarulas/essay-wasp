"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { supabaseClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";

export const Login = () => {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button className="p-6" variant="default">
          Google Login
        </Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col justify-center items-center gap-8">
        <DialogHeader className="flex flex-col items-center">
          <DialogTitle>Google Login</DialogTitle>
          <DialogDescription>Login in with Google</DialogDescription>
        </DialogHeader>

        <Button className="w-1/2 h-12" onClick={handleGoogleLogin}>
          Login
        </Button>
      </DialogContent>
    </Dialog>
  );
};
