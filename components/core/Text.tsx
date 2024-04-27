"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  saveEssayText,
  setEssayContent,
} from "@/redux-store/features/essayStore";
import { toast } from "../ui/use-toast";

export const Text = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tempEssayInfo, is_session_finished, is_timer_running } = useSelector(
    (state: RootState) => state.essayStore
  );

  const [essayText, setEssayText] = useState<string>("");

  const handleEssayChange = (event: any) => {
    setEssayText(event.target.value);
  };

  const handleSaveEssayText = async (text: string) => {
    await dispatch(saveEssayText(text));
  };

  useEffect(() => {
    if (tempEssayInfo.essay_text && tempEssayInfo.essay_text !== "") {
      setEssayText(tempEssayInfo.essay_text);
    } else {
      setEssayText("");
    }
  }, [tempEssayInfo.essay_text]);

  useEffect(() => {
    if (is_session_finished && essayText) {
      dispatch(setEssayContent(essayText));
      handleSaveEssayText(essayText);
    }

    return;
  }, [is_session_finished]);

  return (
    <Textarea
      disabled={!is_timer_running}
      value={essayText}
      onChange={(e) => handleEssayChange(e)}
      className="w-1/2 h-[70%] p-4 border-[3.5px]"
      placeholder="Type your essay here..."
    />
  );
};
