"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import { setEssayContent } from "@/redux-store/features/essayStore";

export const EssayText = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tempEssayInfo, is_session_finished } = useSelector(
    (state: RootState) => state.essayStore
  );

  const [essayText, setEssayText] = useState<string>("");

  useEffect(() => {
    if (tempEssayInfo.essay_text && tempEssayInfo.essay_text !== "") {
      setEssayText(tempEssayInfo.essay_text);
    } else {
      setEssayText("");
    }
  }, [tempEssayInfo.essay_text]);

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
