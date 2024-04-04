"use client";

import { cn } from "@/lib/utils";
import styles from "./Login.style.module.scss";
import { createClient } from "@/utils/supabase/client";

export const Login = () => {
  const supabase = createClient();

  const getURL = () => {
    let url =
      process?.env?.NEXT_PUBLIC_LOCAL_SITE_URL ??
      process?.env?.NEXT_PUBLIC_VERCEL_URL ??
      "";

    url = url.includes("http") ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;

    console.log("url: ", url);
    return url;
  };

  const handleGoogleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        redirectTo: getURL(),
      },
    });

    console.log("error", error);
    console.log("data", data);
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
