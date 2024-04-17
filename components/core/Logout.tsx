"use client";

import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export const Logout = () => {
  const router = useRouter();
  const supabase = supabaseClient();

  const handleLogoutGoogle = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <Button
      className="rounded-[0px] border-none h-8"
      variant="outline"
      onClick={handleLogoutGoogle}
    >
      Logout
    </Button>
  );
};
