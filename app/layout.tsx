import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import ProviderRedux from "@/redux-store/Provider";
import { Mulish } from "next/font/google";

const font = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Essay Wasp",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn("min-h-screen bg-background antialiased", font.className)}
      >
        <ProviderRedux>{children}</ProviderRedux>
      </body>
    </html>
  );
}
