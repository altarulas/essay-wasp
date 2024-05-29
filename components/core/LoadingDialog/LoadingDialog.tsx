"use client";

import { Loader2 } from "lucide-react";

import { AlertDialog, AlertDialogContent } from "@/components/ui/alert-dialog";
import styles from "./LoadingDialog.module.scss";

export const LoadingDialog = ({ open }: { open: boolean }) => {
  if (!open) {
    return;
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className={styles.alertContent}>
        <Loader2 data-testid="loading-icon" className={styles.loading} />
      </AlertDialogContent>
    </AlertDialog>
  );
};
