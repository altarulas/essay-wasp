"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "@/components/ui/toaster";

export default function ProviderRedux({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      {children}
      <Toaster />
    </Provider>
  );
}
