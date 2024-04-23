"use client";

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { RootState } from "@/redux-store/store";
import { aiFeedback, aiQuestion } from "./aiFunctions";

const supabase = supabaseClient();

interface IEssay {
  essay_question: string;
  essay_text: string;
  essay_feedback: string;
}

interface ISavedEssay {
  essay_question: string;
  essay_text: string;
  essay_feedback: string;
  created_at: Date | null;
}

interface IEssayInfo {
  essayInfo: IEssay;
  savedEssayInfo: ISavedEssay[] | [];
  is_session_finished: boolean;
}

const initialState: IEssayInfo = {
  essayInfo: {
    essay_question: "",
    essay_text: "",
    essay_feedback: "",
  },
  savedEssayInfo: [],
  is_session_finished: false,
};

export const startEssaySession = createAsyncThunk(
  "essayStore/startEssaySession",

  async (selected_question: string, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;
      const email_address = state.userInfoStore.user.email_address;
      const credit = state.userInfoStore.credits;

      if (credit >= 10) {
        dispatch(createQuestion({ selected_question, email_address }));
      }
    } catch (error) {
      console.error(error);
    }
  }
);

export const createQuestion = createAsyncThunk(
  "essayStore/createQuestion",

  async ({
    selected_question,
    email_address,
  }: {
    selected_question: string;
    email_address: string;
  }) => {
    try {
      const response = await aiQuestion(selected_question);

      if (!response) return initialState.essayInfo.essay_question;
      if (!email_address) return initialState.essayInfo.essay_question;

      const { data, error } = await supabase
        .from("temp_users_essay")
        .insert({ email_address, essay_question: response });

      if (!error) {
        return response;
      }
    } catch (error) {
      console.error(error);
    }
    return initialState.essayInfo.essay_question;
  }
);

export const createFeedback = createAsyncThunk(
  "essayStore/createFeedback",

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
    const email_address = state.userInfoStore.user.email_address;
    let essay_feedback: string = "";

    try {
      const response = await aiFeedback(essay_question, essay_text);

      if (!response) return essay_feedback;

      const { data, error } = await supabase
        .from("temp_users_essay")
        .update({ essay_text, essay_feedback: response })
        .eq("email_address", email_address)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error) {
        return essay_feedback;
      }
    } catch (error) {
      console.error(error);
    }

    return essay_feedback;
  }
);

export const saveEssayInfo = createAsyncThunk(
  "essayStore/saveEssayInfo",

  async (_, { getState }) => {
    const state = getState() as RootState;

    const email_address = state.userInfoStore.user.email_address;
    const essay_question = state.essayStore.essayInfo.essay_question;
    const essay_text = state.essayStore.essayInfo.essay_text;
    const essay_feedback = state.essayStore.essayInfo.essay_feedback;

    try {
      const { data, error } = await supabase
        .from("users_essay")
        .insert({ email_address, essay_question, essay_text, essay_feedback });

      if (!error) {
        return;
      }
    } catch (error) {
      console.error(error);
    }

    return;
  }
);

export const getUserSavedEssay = createAsyncThunk(
  "essayStore/getUserSavedEssay",

  async (_, { getState }) => {
    const state = getState() as RootState;
    const email_address = state.userInfoStore.user.email_address;

    let essay: ISavedEssay[] = [];

    try {
      const { data, error } = await supabase
        .from("users_essay")
        .select("essay_question, essay_text, essay_feedback, created_at")
        .eq("email_address", email_address);

      if (!error) {
        essay = data;
        return essay;
      }
    } catch (error) {
      console.error(error);
    }

    return essay;
  }
);

export const getUserTempEssay = createAsyncThunk(
  "essayStore/getUserEssay",

  async (_, { getState }) => {
    const state = getState() as RootState;
    const email_address = state.userInfoStore.user.email_address;

    let essay: IEssay = {
      essay_question: "",
      essay_text: "",
      essay_feedback: "",
    };

    try {
      const { data, error } = await supabase
        .from("temp_users_essay")
        .select("essay_question, essay_text, essay_feedback")
        .eq("email_address", email_address)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!error) {
        essay = data;
        return essay;
      }
    } catch (error) {
      console.error(error);
    }

    return essay;
  }
);

export const EssayStore = createSlice({
  name: "essay",
  initialState,
  reducers: {
    resetState: (state) => {
      state.essayInfo = initialState.essayInfo;
      state.is_session_finished = initialState.is_session_finished;
    },
    finishSession: (state) => {
      state.is_session_finished = true;
    },
    setEssayContent: (state, action: PayloadAction<string>) => {
      state.essayInfo.essay_text = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startEssaySession.fulfilled, () => {})

      .addCase(createQuestion.fulfilled, (state, action) => {
        state.essayInfo.essay_question = action.payload;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.essayInfo.essay_feedback = action.payload;
      })
      .addCase(getUserTempEssay.fulfilled, (state, action) => {
        const { essay_question, essay_text, essay_feedback } = action.payload;
        state.essayInfo.essay_question = essay_question;
        state.essayInfo.essay_text = essay_text;
        state.essayInfo.essay_feedback = essay_feedback;
      })
      .addCase(getUserSavedEssay.fulfilled, (state, action) => {
        state.savedEssayInfo = action.payload;
      });
  },
});

export const { resetState, finishSession, setEssayContent } =
  EssayStore.actions;
export default EssayStore.reducer;
