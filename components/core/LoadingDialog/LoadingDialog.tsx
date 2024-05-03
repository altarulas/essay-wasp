"use client";

import { Loader2 } from "lucide-react";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";

export const LoadingDialog = ({ open }: { open: boolean }) => {
  if (!open) {
    return;
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-transparent border-none w-fit h-fit flex justify-center items-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </AlertDialogContent>
    </AlertDialog>
  );
};
