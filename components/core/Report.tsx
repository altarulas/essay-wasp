"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import dayjs from "dayjs";

interface ReportProps {
  createdAt: Date | null;
  essayQuestion: string;
  essayText: string;
  essayFeedback: string;
}

export const Report = (props: ReportProps) => {
  const { createdAt, essayQuestion, essayText, essayFeedback } = props;
  const formattedCreatedAt = dayjs(createdAt).format("YYYY-MM-DD HH:mm");

  return (
    <div className="w-full flex items-center justify-between">
      <Button className="w-40"> {formattedCreatedAt} </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Show Essay</Button>
        </DialogTrigger>

        <DialogContent className="max-w-[750px] space-y-4 overflow-y-auto">
          <DialogHeader className="space-y-6">
            <DialogTitle> Essay Topic </DialogTitle>
            <DialogDescription>{essayQuestion}</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6">
            <DialogTitle> Essay Content </DialogTitle>
            <DialogDescription>{essayText}</DialogDescription>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Show Feedback</Button>
        </DialogTrigger>

        <DialogContent className="max-w-[750px] space-y-4 overflow-y-auto">
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
