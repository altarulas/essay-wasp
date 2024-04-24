import { supabaseClient } from "@/utils/supabase/client";

const supabase = supabaseClient();

export const aiQuestion = async (selected_question: string) => {
  try {
    const response = await supabase.functions.invoke("question", {
      body: {
        question_type: selected_question,
      },
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};

export const aiFeedback = async (
  essay_question: string,
  essay_text: string
) => {
  try {
    const response = await supabase.functions.invoke("feedback", {
      body: {
        topic: essay_question,
        essay: essay_text,
      },
    });

    return response;
  } catch (error) {
    console.error(error);
  }
};
