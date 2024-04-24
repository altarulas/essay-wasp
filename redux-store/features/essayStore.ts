"use client";

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { RootState } from "@/redux-store/store";
import { aiFeedback, aiQuestion } from "./aiFunctions";

const supabase = supabaseClient();

interface ITempEssay {
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
  tempEssayInfo: ITempEssay;
  savedEssayInfo: ISavedEssay[] | [];
  is_timer_running: boolean;
  is_session_finished: boolean;
}

const initialState: IEssayInfo = {
  tempEssayInfo: {
    essay_question: "",
    essay_text: "",
    essay_feedback: "",
  },
  savedEssayInfo: [],
  is_timer_running: false,
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
    let essay_question: string = "";

    try {
      const response = await aiQuestion(selected_question);

      if (response?.error) {
        return response.error?.message;
      }

      essay_question = response?.data;

      const { data, error } = await supabase
        .from("temp_users_essay")
        .insert({ email_address, essay_question: essay_question });

      if (!error) {
        return essay_question;
      }
    } catch (error) {
      console.error(error);
    }
    return essay_question;
  }
);

export const saveEssayText = createAsyncThunk(
  "essayStore/saveEssayText",

  async (essay_text: string, { getState }) => {
    const state = getState() as RootState;
    const email_address = state.userInfoStore.user.email_address;

    try {
      const { data, error } = await supabase
        .from("temp_users_essay")
        .update({ essay_text: essay_text })
        .eq("email_address", email_address)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error) {
        return essay_text;
      }
    } catch (error) {
      console.error(error);
    }
    return essay_text || "";
  }
);

export const createFeedback = createAsyncThunk(
  "essayStore/createFeedback",

  async (_, { getState }) => {
    const state = getState() as RootState;
    const email_address = state.userInfoStore.user.email_address;
    const essay_question = state.essayStore.tempEssayInfo.essay_question;
    const essay_text = state.essayStore.tempEssayInfo.essay_text;

    let essay_feedback: string = "";

    try {
      const response = await aiFeedback(essay_question, essay_text);

      if (response?.error) {
        return response.error.message;
      }

      essay_feedback = response?.data;

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
    const essay_question = state.essayStore.tempEssayInfo.essay_question;
    const essay_text = state.essayStore.tempEssayInfo.essay_text;
    const essay_feedback = state.essayStore.tempEssayInfo.essay_feedback;

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

export const deleteAllTempEssayInfo = createAsyncThunk(
  "essayStore/deleteAllTempEssayInfo",

  async (_, { getState }) => {
    const state = getState() as RootState;
    const email_address = state.userInfoStore.user.email_address;

    try {
      const { error } = await supabase
        .from("temp_users_essay")
        .delete()
        .eq("email_address", email_address);

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

  async () => {
    const email_address = (await supabase.auth.getUser()).data.user?.email;

    let essay: ISavedEssay[] = [];

    try {
      const { data, error } = await supabase
        .from("users_essay")
        .select("essay_question, essay_text, essay_feedback, created_at")
        .eq("email_address", email_address);

      console.log("data", data);
      console.log("error", error);

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

    let essay: ITempEssay = {
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
      state.tempEssayInfo = initialState.tempEssayInfo;
      state.is_session_finished = initialState.is_session_finished;
    },
    startSession: (state) => {
      localStorage.setItem("is_session_finished", "false");
      localStorage.setItem("is_timer_running", "true");

      const endTime = Date.now() + 40 * 60 * 1000; // 40 minutes in milliseconds
      localStorage.setItem("countdown_end_time", endTime.toString());

      state.is_timer_running = true;
    },
    finishSession: (state) => {
      localStorage.setItem("is_session_finished", "true");
      localStorage.setItem("is_timer_running", "false");

      state.is_session_finished = true;
      state.is_timer_running = false;
    },
    getSession: (state) => {
      const isFinished = localStorage.getItem("is_session_finished") === "true";
      const isStarted = localStorage.getItem("is_timer_running") === "true";

      state.is_timer_running = isStarted;
      state.is_session_finished = isFinished;
    },
    setEssayContent: (state, action: PayloadAction<string>) => {
      state.tempEssayInfo.essay_text = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startEssaySession.fulfilled, () => {})
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.tempEssayInfo.essay_question = action.payload;
      })
      .addCase(saveEssayText.fulfilled, (state, action) => {
        state.tempEssayInfo.essay_text = action.payload;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.tempEssayInfo.essay_feedback = action.payload;
      })
      .addCase(getUserTempEssay.fulfilled, (state, action) => {
        const { essay_question, essay_text, essay_feedback } = action.payload;
        state.tempEssayInfo.essay_question = essay_question;
        state.tempEssayInfo.essay_text = essay_text;
        state.tempEssayInfo.essay_feedback = essay_feedback;
      })
      .addCase(getUserSavedEssay.fulfilled, (state, action) => {
        state.savedEssayInfo = action.payload;
      });
  },
});

export const {
  resetState,
  finishSession,
  setEssayContent,
  startSession,
  getSession,
} = EssayStore.actions;
export default EssayStore.reducer;
