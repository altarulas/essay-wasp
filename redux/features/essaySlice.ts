"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { RootState } from "@/redux/store";
import { aiFeedback, aiQuestion } from "./aiFunctions";

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

export const startEssaySession = createAsyncThunk(
  "tempEssaySlice/startEssaySession",

  async (selected_question: string, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const email_address = state.userInfo.email_address;

      dispatch(EssaySlice.actions.resetState());
      dispatch(createQuestion({ selected_question, email_address }));
    } catch (error) {
      console.error(error);
    }
  }
);

export const createQuestion = createAsyncThunk(
  "tempEssaySlice/createQuestion",

  async ({
    selected_question,
    email_address,
  }: {
    selected_question: string;
    email_address: string;
  }) => {
    try {
      const response = await aiQuestion(selected_question);

      if (!response) return initialState.essay_question;
      if (!email_address) return initialState.essay_question;

      const { data, error } = await supabase
        .from("temp_users_essay")
        .insert({ email_address, essay_question: response });

      if (!error) {
        return response;
      }
    } catch (error) {
      console.error(error);
    }
    return initialState.essay_question;
  }
);

export const createFeedback = createAsyncThunk(
  "tempEssaySlice/createFeedbackAndAddEssay",

  async (
    {
      essay_text,
      essay_question,
    }: {
      essay_text: string;
      essay_question: string;
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    const email_address = state.userInfo.email_address;

    try {
      const response = await aiFeedback(essay_question, essay_text);

      if (!response) return { essay_text: essay_text, essay_feedback: "" };

      console.log("essay_text: ", essay_text);
      console.log("feed: ", response);

      const { data, error } = await supabase
        .from("temp_users_essay")
        .update({ essay_text, essay_feedback: response })
        .eq("email_address", email_address)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error) {
        return { essay_text, essay_feedback: response };
      }
    } catch (error) {
      console.error(error);
    }

    return { essay_text: essay_text, essay_feedback: "" };
  }
);

export const getUserEssay = createAsyncThunk(
  "tempEssaySlice/getUserEssay",

  async (_, { getState }) => {
    const state = getState() as RootState;
    const email_address = state.userInfo.email_address;

    try {
      const { data, error } = await supabase
        .from("temp_users_essay")
        .select("essay_question, essay_text, essay_feedback")
        .eq("email_address", email_address)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error) {
        const essay: IEssayInformation = data;
        return essay;
      }
    } catch (error) {
      console.error(error);
    }

    return initialState;
  }
);

export const EssaySlice = createSlice({
  name: "essay",
  initialState,
  reducers: {
    resetState: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startEssaySession.fulfilled, () => {})

      .addCase(createQuestion.fulfilled, (state, action) => {
        state.essay_question = action.payload;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.essay_text = action.payload.essay_text;
        state.essay_feedback = action.payload.essay_feedback;
      })
      .addCase(getUserEssay.fulfilled, (state, action) => {
        const { essay_question, essay_text, essay_feedback } = action.payload;
        state.essay_question = essay_question;
        state.essay_text = essay_text;
        state.essay_feedback = essay_feedback;
      });
  },
});

export const { resetState } = EssaySlice.actions;
export default EssaySlice.reducer;
