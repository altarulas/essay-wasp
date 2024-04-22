"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { RootState } from "@/redux-store/store";
import { useSelector } from "react-redux";

export const EssayContent = () => {
  const { essay_text } = useSelector((state: RootState) => state.essayStore);

  const [essay, setEssay] = useState<string>("");

  useEffect(() => {
    essay_text && setEssay(essay_text);
  }, [essay_text]);

  const handleEssayChange = (event: any) => {
    setEssay(event.target.value);
  };

  return (
    <Textarea
      value={essay}
      onChange={(e) => handleEssayChange(e)}
      className="w-1/2 h-96"
      placeholder="Type your essay here."
    />
  );
};
