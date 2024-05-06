"use client";

import { supabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import { LoadingDialog } from "../LoadingDialog/LoadingDialog";
import { useState } from "react";

export const Logout = () => {
  const router = useRouter();
  const supabase = supabaseClient();

  const [loading, setLoading] = useState<boolean>(false);

  const handleLogoutGoogle = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/");
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="rounded-sm h-8 hover:bg-white"
        onClick={handleLogoutGoogle}
      >
        Logout
      </Button>
      <LoadingDialog open={loading} />
    </>
  );
};
