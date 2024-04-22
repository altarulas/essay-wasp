"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import { setEssayContent } from "@/redux-store/features/essayStore";

export const EssayContent = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { essayInfo, is_session_finished } = useSelector(
    (state: RootState) => state.essayStore
  );

  const [essayText, setEssayText] = useState<string>("");

  useEffect(() => {
    if (essayInfo.essay_text && essayInfo.essay_text !== "") {
      setEssayText(essayInfo.essay_text);
    } else {
      setEssayText("");
    }
  }, [essayInfo.essay_text]);

  useEffect(() => {
    if (is_session_finished) {
      dispatch(setEssayContent(essayText));
    }
    return;
  }, [is_session_finished]);

  const handleEssayChange = (event: any) => {
    setEssayText(event.target.value);
  };

  return (
    <Textarea
      value={essayText}
      onChange={(e) => handleEssayChange(e)}
      className="w-1/2 h-96"
      placeholder="Type your essay here."
    />
  );
};
