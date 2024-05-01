"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  saveEssayText,
  setEssayContent,
} from "@/redux-store/features/essayStore";

export const Text = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tempEssayInfo, sessionConditions } = useSelector(
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
    if (sessionConditions.is_session_finished && essayText) {
      dispatch(setEssayContent(essayText));
      handleSaveEssayText(essayText);
    }

    return;
  }, [sessionConditions.is_session_finished]);

  return (
    <Textarea
      disabled={!sessionConditions.is_timer_running}
      value={essayText}
      onChange={(e) => handleEssayChange(e)}
      className="w-1/2 h-[70%] p-4 bg-zinc-50 dark:bg-zinc-900"
      placeholder="Type your essay here..."
    />
  );
};
