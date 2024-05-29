"use client";

import { useEffect, useState } from "react";
import { Textarea } from "../../ui/textarea";
import { AppDispatch, RootState } from "@/redux-store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  saveEssayText,
  setEssayContent,
} from "@/redux-store/features/essayStore";
import { IoMdInformationCircleOutline } from "react-icons/io";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styles from "./Text.module.scss";

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
    <div className="w-1/2 h-[70%] flex flex-col items-end gap-1 -mt-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            data-testid="tooltip-button"
            className="cursor-default h-fit"
          >
            <IoMdInformationCircleOutline className="h-6 w-6 text-neutral-300" />
          </TooltipTrigger>
          <TooltipContent data-testid="tooltip-info">
            <p>min 250, max 400 words</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Textarea
        disabled={!sessionConditions.is_timer_running}
        value={essayText}
        onChange={(e) => handleEssayChange(e)}
        className={styles.textContainer}
        placeholder="Type your essay here..."
      />
    </div>
  );
};
