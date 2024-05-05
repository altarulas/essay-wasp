"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import dayjs from "dayjs";
import styles from "./Report.module.scss";

interface ReportProps {
  createdAt: Date | null;
  leftTime: string;
  essayQuestion: string;
  essayText: string;
  essayFeedback: string;
}

export const Report = (props: ReportProps) => {
  const { createdAt, leftTime, essayQuestion, essayText, essayFeedback } =
    props;
  const formattedCreatedAt = dayjs(createdAt).format("YYYY-MM-DD");

  return (
    <div className={styles.container}>
      <div className={styles.date}>{formattedCreatedAt}</div>
      <div className={styles.time}>{leftTime}</div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Show Essay</Button>
        </DialogTrigger>

        <DialogContent className={styles.dialogContent}>
          <DialogHeader className="space-y-6">
            <DialogTitle> Essay Topic </DialogTitle>
            <DialogDescription>{essayQuestion}</DialogDescription>
          </DialogHeader>

          <DialogHeader className="space-y-6">
            <DialogTitle> Essay Content </DialogTitle>
            <DialogDescription>{essayText}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Show Feedback</Button>
        </DialogTrigger>

        <DialogContent className={styles.dialogContent}>
          <DialogHeader className="space-y-6">
            <DialogTitle> Essay Feedback </DialogTitle>
            <DialogDescription className="whitespace-pre-wrap">
              {essayFeedback}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};