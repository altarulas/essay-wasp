"use client";

import { cn } from "@/lib/utils";
import styles from "./Login.style.module.scss";

export const Login = () => {
  const handleGoogleLogin = () => {
    console.log("im working");
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
