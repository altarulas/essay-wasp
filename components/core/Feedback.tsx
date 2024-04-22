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
import { RootState } from "@/redux-store/store";
import { useSelector } from "react-redux";

export const Feedback = () => {
  const { essay_feedback } = useSelector(
    (state: RootState) => state.essayStore
  );

  return (
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
        {essay_feedback}
        <DialogFooter>
          <Button type="submit">Save My Essay and Feedback</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
