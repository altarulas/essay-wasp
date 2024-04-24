"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      <Button> {formattedCreatedAt} </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Show Essay</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle> {essayQuestion} </DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          {essayText}
          <DialogFooter>
            <Button type="submit">Save My Essay and Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button>Show Feedback</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          {essayFeedback}
          <DialogFooter>
            <Button type="submit">Save My Essay and Feedback</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
