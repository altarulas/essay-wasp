"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import styles from "./PremiumDailog.module.scss";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export const PremiumDialog = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className={styles.button}>Use Unlimited</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>About Premium Usage</AlertDialogTitle>
          <AlertDialogDescription className="text-[10px]">
            We are using Buy Me Coffee as a payment method. To understand your
            sales purchase, enter the e-mail address of your gmail account that
            you registered with Natural Lang. By doing this, you are creating a
            Buy Me Coffee account with that e-mail. In Buy Me Coffee, you will
            be able to manage all subscription operations.
          </AlertDialogDescription>
          <AlertDialogTitle>Important!!!</AlertDialogTitle>
          <AlertDialogDescription className="text-red-700 text-[10px] font-bold">
            If you purchase a membership from Buy Me Coffee with a different
            e-mail address than the e-mail address you entered in Essay Wasp,
            you will not be able to get premium rights and you will also waste
            your money.
          </AlertDialogDescription>

          <div className="w-full flex justify-center items-center py-2">
            <Image
              className="rounded-2xl"
              src="/upgrade.png"
              height={200}
              width={250}
              alt="upgrade"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Link
            target="_blank"
            href="https://buymeacoffee.com/essaywasp/membership"
          >
            <AlertDialogAction>Go to Buy Me Coffee</AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
