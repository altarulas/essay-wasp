import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";

const supabase = supabaseClient();

interface IEssayInformation {
  essay_question: string;
  essay_text: string;
  essay_feedback: string;
}

const initialState: IEssayInformation = {
  essay_question: "",
  essay_text: "",
  essay_feedback: "",
};

export const addQuestion = createAsyncThunk(
  "tempEssaySlice/addQuestion",

  async (selected_question: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("question", {
        body: {
          question_type: selected_question,
        },
      });

      const essay_question: string = data;

      if (!error) {
        const { data, error } = await supabase
          .from("temp_users_essay")
          .insert({ email_address, essay_question });

        if (!error) {
          return essay_question;
        } else {
          console.error(error);
        }
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }

    return "";
  }
);

export const addEssayAndFeedback = createAsyncThunk(
  "tempEssaySlice/addEssayAndFeedback",

  async ({
    essay_text,
    essay_question,
  }: {
    essay_text: string;
    essay_question: string;
  }) => {
    try {
      const { data, error } = await supabase.functions.invoke("feedback", {
        body: {
          topic: essay_question,
          essay: essay_text,
        },
      });

      const essay_feedback: string = data;

      if (!error) {
        const { data, error } = await supabase
          .from("temp_users_essay")
          .update({ essay_text, essay_feedback })
          .eq("email_address", email_address);

        if (!error) {
          return { essay_text, essay_feedback };
        } else {
          console.error(error);
        }
      } else {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }

    return { essay_text: "", essay_feedback: "" };
  }
);

export const getUserEssay = createAsyncThunk(
  "tempEssaySlice/getUserEssay",
  async (email_address: string) => {
    try {
      const { data, error } = await supabase
        .from("temp_users_essay")
        .select("essay_question, essay_text, essay_feedback")
        .eq("email_address", email_address)
        .single();

      if (!error) {
        const essay: IEssayInformation = data;
        return essay; // Return the entire essay object
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

export const tempEssaySlice = createSlice({
  name: "tempEssay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addQuestion.fulfilled, (state, action) => {
        state.essay_question = action.payload;
      })
      .addCase(addEssayAndFeedback.fulfilled, (state, action) => {
        state.essay_text = action.payload?.essay_text;
        state.essay_feedback = action.payload?.essay_feedback;
      })
      .addCase(getUserEssay.fulfilled, (state, action) => {
        const { essay_question, essay_text, essay_feedback } = action.payload;
        state.essay_question = essay_question;
        state.essay_text = essay_text;
        state.essay_feedback = essay_feedback;
      });
  },
});

export default tempEssaySlice.reducer;
