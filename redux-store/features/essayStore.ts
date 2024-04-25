"use client";

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { RootState } from "@/redux-store/store";
import { aiFeedback, aiQuestion } from "./aiFunctions";
import { updateUserCredit } from "./userInfoStore";

const supabase = supabaseClient();

interface ICost {
  create_question_cost: number | null;
  create_feedback_cost: number | null;
  save_essay_cost: number | null;
}

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
  operationCosts: ICost;
  is_session_started: boolean;
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
  operationCosts: {
    create_question_cost: null,
    create_feedback_cost: null,
    save_essay_cost: null,
  },
  is_session_started: false,
  is_timer_running: false,
  is_session_finished: false,
};

export const createEssaySession = createAsyncThunk(
  "essayStore/createEssaySession",

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

  async (
    {
      selected_question,
      email_address,
    }: {
      selected_question: string;
      email_address: string;
    },
    { dispatch, getState }
  ) => {
    let essay_question: string = "";
    const state = getState() as RootState;
    const cost = state.essayStore.operationCosts.create_question_cost;

    if (!cost) return;

    try {
      const creditResponse = await dispatch(
        updateUserCredit({
          email_address: email_address,
          spend_credits: cost,
        })
      );

      if (!creditResponse.payload) {
        return "Credit error";
      }

      const aiResponse = await aiQuestion(selected_question);

      if (aiResponse?.error) {
        return aiResponse.error?.message;
      }

      essay_question = aiResponse?.data;

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

export const createFeedback = createAsyncThunk(
  "essayStore/createFeedback",

  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const email_address = state.userInfoStore.user.email_address;
    const essay_question = state.essayStore.tempEssayInfo.essay_question;
    const essay_text = state.essayStore.tempEssayInfo.essay_text;

    let essay_feedback: string = "";

    const cost = state.essayStore.operationCosts.create_feedback_cost;
    if (!cost) return;

    try {
      const creditResponse = await dispatch(
        updateUserCredit({
          email_address: email_address,
          spend_credits: cost,
        })
      );

      if (!creditResponse.payload) {
        return "Credit error";
      }

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

export const saveEssayText = createAsyncThunk(
  "essayStore/saveEssayText",

  async (essay_text: string, { getState, dispatch }) => {
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

export const saveEssayInfo = createAsyncThunk(
  "essayStore/saveEssayInfo",

  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;

    const email_address = state.userInfoStore.user.email_address;
    const essay_question = state.essayStore.tempEssayInfo.essay_question;
    const essay_text = state.essayStore.tempEssayInfo.essay_text;
    const essay_feedback = state.essayStore.tempEssayInfo.essay_feedback;
    const cost = state.essayStore.operationCosts.save_essay_cost;

    if (!cost) return;

    try {
      const creditResponse = await dispatch(
        updateUserCredit({
          email_address: email_address,
          spend_credits: cost,
        })
      );

      if (!creditResponse.payload) {
        return "Credit error";
      }

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

export const getOperationCosts = createAsyncThunk(
  "essayStore/getOperationCosts",

  async () => {
    let costs: ICost = {
      create_question_cost: null,
      create_feedback_cost: null,
      save_essay_cost: null,
    };

    try {
      const { data, error } = await supabase
        .from("operation_costs")
        .select("create_question_cost, create_feedback_cost, save_essay_cost")
        .single();

      if (!error) {
        costs = data;
        return costs;
      }
    } catch (error) {
      console.error(error);
    }

    return costs;
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
    createSession: (state) => {
      localStorage.setItem("is_session_started", "true");
      state.is_session_started = true;
    },
    startSession: (state) => {
      localStorage.setItem("is_session_finished", "false");
      localStorage.setItem("is_timer_running", "true");

      const endTime = Date.now() + 40 * 60 * 1000; // 40 minutes in milliseconds
      localStorage.setItem("countdown_end_time", endTime.toString());

      state.is_timer_running = true;
    },
    finishSession: (state) => {
      localStorage.setItem("is_session_started", "false");
      localStorage.setItem("is_session_finished", "true");
      localStorage.setItem("is_timer_running", "false");

      state.is_session_started = false;
      state.is_session_finished = true;
      state.is_timer_running = false;
    },
    postSaveSession: (state) => {
      state.is_session_started = false;
      state.is_session_finished = false;
      state.is_timer_running = false;
    },
    getSession: (state) => {
      const start = localStorage.getItem("is_session_finished") === "true";
      const finish = localStorage.getItem("is_session_finished") === "true";
      const timer = localStorage.getItem("is_timer_running") === "true";

      state.is_timer_running = timer;
      state.is_session_started = start;
      state.is_session_finished = finish;
    },
    setEssayContent: (state, action: PayloadAction<string>) => {
      state.tempEssayInfo.essay_text = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEssaySession.fulfilled, () => {})
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.tempEssayInfo.essay_question = action.payload;
      })
      .addCase(saveEssayText.fulfilled, (state, action) => {
        state.tempEssayInfo.essay_text = action.payload;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.tempEssayInfo.essay_feedback = action.payload;
      })
      .addCase(getOperationCosts.fulfilled, (state, action) => {
        state.operationCosts = action.payload;
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
  setEssayContent,
  createSession,
  startSession,
  finishSession,
  postSaveSession,
  getSession,
} = EssayStore.actions;
export default EssayStore.reducer;
