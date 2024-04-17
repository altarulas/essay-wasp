"use client";

import { supabaseClient } from "@/utils/supabase/client";

const supabase = supabaseClient();

export const aiQuestion = async (selected_question: string) => {
  try {
    const { data, error } = await supabase.functions.invoke("question", {
      body: {
        question_type: selected_question,
      },
    });

    if (!error) {
      const essay_question: string = data;
      return essay_question;
    }
  } catch (error) {
    console.error(error);
  }
};

export const aiFeedback = async (
  essay_question: string,
  essay_text: string
) => {
  try {
    const { data, error } = await supabase.functions.invoke("feedback", {
      body: {
        topic: essay_question,
        essay: essay_text,
      },
    });

    if (!error) {
      const essay_feedback: string = data;
      return essay_feedback;
    }
  } catch (error) {
    console.error(error);
  }
};
