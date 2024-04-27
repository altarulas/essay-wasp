"use client";

import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { RootState } from "@/redux-store/store";
import { aiFeedback, aiQuestion } from "./aiFunctions";
import { updateUserCredit } from "./userInfoStore";
import { toast } from "@/components/ui/use-toast";

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

interface ISessionConditions {
  is_session_started: boolean;
  is_timer_running: boolean;
  show_timer: boolean;
  is_session_finished: boolean;
  left_time: string | null;
}

interface ILoading {
  isEssayStoreLoading: boolean;
  isQuestionLoading: boolean;
  isSavingEssayText: boolean;
  isFeedbackLoading: boolean;
  isSavingAllEssayInfo: boolean;
  isDeletingAllEssayInfo: boolean;
  isSavedSessionLoading: boolean;
  isDialogOpen: boolean;
}

interface IEssayInfo {
  tempEssayInfo: ITempEssay;
  savedEssayInfo: ISavedEssay[] | [];
  operationCosts: ICost;
  sessionConditions: ISessionConditions;
  loadingStates: ILoading;
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
  sessionConditions: {
    is_session_started: false,
    is_timer_running: false,
    show_timer: false,
    is_session_finished: false,
    left_time: null,
  },
  loadingStates: {
    isEssayStoreLoading: true,
    isQuestionLoading: false,
    isSavingEssayText: false,
    isFeedbackLoading: false,
    isSavingAllEssayInfo: false,
    isDeletingAllEssayInfo: false,
    isSavedSessionLoading: false,
    isDialogOpen: false,
  },
};

export const createEssaySession = createAsyncThunk(
  "essayStore/createEssaySession",

  async (selected_question: string, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;

      const email_address = state.userInfoStore.user.email_address;
      const credit = state.userInfoStore.user.credits;
      const isUserSub = state.userInfoStore.user.subscription_info.status;

      if (!email_address || !credit) {
        return toast({ title: "Something went wrong" });
      }

      if (!isUserSub) {
        if (credit >= 10) {
          await dispatch(createQuestion({ selected_question, email_address }));
        } else {
          return toast({ title: "Credits are not enough" });
        }
      } else {
        await dispatch(createQuestion({ selected_question, email_address }));
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong" });
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

    const isUserSub = state.userInfoStore.user.subscription_info.status;
    const cost = state.essayStore.operationCosts.create_question_cost;

    if (!selected_question) {
      toast({ title: "Please select an essay topic type" });
      return essay_question;
    }

    if (!email_address || !cost) {
      toast({ title: "Something went wrong" });
      return essay_question;
    }

    try {
      if (!isUserSub) {
        const creditResponse = await dispatch(
          updateUserCredit({
            email_address: email_address,
            spend_credits: cost,
          })
        );

        if (!creditResponse.payload) {
          return essay_question;
        }
      }

      const aiResponse = await aiQuestion(selected_question);

      if (aiResponse?.error) {
        const message = aiResponse.error.context.text();
        toast({ title: message });
        return essay_question;
      }

      essay_question = aiResponse?.data;

      const { data, error } = await supabase
        .from("temp_users_essay")
        .insert({ email_address, essay_question: essay_question });

      if (!error) {
        return essay_question;
      } else {
        toast({ title: "Something went wrong" });
        return essay_question;
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong" });
    }

    return essay_question;
  }
);

export const saveEssayText = createAsyncThunk(
  "essayStore/saveEssayText",

  async (essay_text: string, { getState, dispatch }) => {
    const state = getState() as RootState;

    const email_address = state.userInfoStore.user.email_address;

    if (!email_address) {
      toast({ title: "Something went wrong" });
      return essay_text;
    }

    if (!essay_text) {
      toast({ title: "Essay content is missing" });
      return essay_text;
    }

    try {
      const { data, error } = await supabase
        .from("temp_users_essay")
        .update({ essay_text: essay_text })
        .eq("email_address", email_address)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error) {
        return essay_text;
      } else {
        toast({ title: "Something went wrong" });
        return essay_text;
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong" });
    }
    return essay_text || "";
  }
);

export const createFeedback = createAsyncThunk(
  "essayStore/createFeedback",

  async (_, { getState, dispatch }) => {
    let essay_feedback: string = "";

    const state = getState() as RootState;

    const email_address = state.userInfoStore.user.email_address;
    const essay_question = state.essayStore.tempEssayInfo.essay_question;
    const essay_text = state.essayStore.tempEssayInfo.essay_text;
    const isUserSub = state.userInfoStore.user.subscription_info.status;
    const cost = state.essayStore.operationCosts.create_feedback_cost;

    if (!email_address || !cost) {
      toast({ title: "Something went wrong" });
      return essay_feedback;
    }

    if (!essay_question || !essay_text) {
      toast({ title: "Essay content or essay topic is missing" });
      return essay_feedback;
    }

    try {
      if (!isUserSub) {
        const creditResponse = await dispatch(
          updateUserCredit({
            email_address: email_address,
            spend_credits: cost,
          })
        );

        if (!creditResponse.payload) {
          return essay_feedback;
        }
      }

      const response = await aiFeedback(essay_question, essay_text);

      if (response?.error) {
        const message = response.error.context.text();
        toast({ title: message });
        return essay_question;
      }

      essay_feedback = response?.data;

      const { data, error } = await supabase
        .from("temp_users_essay")
        .update({ essay_text, essay_feedback: essay_feedback })
        .eq("email_address", email_address)
        .order("created_at", { ascending: false })
        .limit(1);

      if (!error) {
        return essay_feedback;
      } else {
        toast({ title: "Something went wrong" });
        return essay_feedback;
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong" });
    }

    return essay_feedback;
  }
);

export const saveAllEssayInfo = createAsyncThunk(
  "essayStore/saveAllEssayInfo",

  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;

    const email_address = state.userInfoStore.user.email_address;
    const essay_question = state.essayStore.tempEssayInfo.essay_question;
    const essay_text = state.essayStore.tempEssayInfo.essay_text;
    const essay_feedback = state.essayStore.tempEssayInfo.essay_feedback;
    const cost = state.essayStore.operationCosts.save_essay_cost;
    const isUserSub = state.userInfoStore.user.subscription_info.status;

    if (!email_address || !cost) {
      toast({ title: "Something went wrong" });
      return;
    }

    if (!essay_question || !essay_text || !essay_feedback) {
      toast({ title: "Some essay information are missing" });
      return;
    }

    try {
      if (!isUserSub) {
        const creditResponse = await dispatch(
          updateUserCredit({
            email_address: email_address,
            spend_credits: cost,
          })
        );

        if (!creditResponse.payload) {
          return;
        }
      }

      const { data, error } = await supabase
        .from("users_essay")
        .insert({ email_address, essay_question, essay_text, essay_feedback });

      if (!error) {
        toast({ title: "Essay session is saved" });
        return;
      } else {
        toast({ title: "Something went wrong" });
        return;
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong" });
    }

    return;
  }
);

export const deleteAllTempEssayInfo = createAsyncThunk(
  "essayStore/deleteAllTempEssayInfo",

  async (_, { getState }) => {
    const state = getState() as RootState;

    const email_address = state.userInfoStore.user.email_address;

    if (!email_address) {
      toast({ title: "Something went wrong" });
      return;
    }

    try {
      const { error } = await supabase
        .from("temp_users_essay")
        .delete()
        .eq("email_address", email_address);

      if (!error) {
        toast({ title: "Essay session is deleted" });
        return;
      } else {
        toast({ title: "Something went wrong" });
        return;
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Something went wrong" });
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

export const getEssayStore = createAsyncThunk(
  "essayStore/getEssayStore",

  async (_, { getState, dispatch }) => {
    await dispatch(getOperationCosts());
    await dispatch(getSession());
    await dispatch(getUserTempEssay());
  }
);

export const EssayStore = createSlice({
  name: "essay",
  initialState,
  reducers: {
    resetState: (state) => {
      state.tempEssayInfo = initialState.tempEssayInfo;
      state.sessionConditions = initialState.sessionConditions;
    },
    createSession: (state) => {
      localStorage.setItem("is_session_started", "true");
      state.sessionConditions.is_session_started = true;
    },
    startSession: (state) => {
      localStorage.setItem("is_session_finished", "false");
      localStorage.setItem("is_timer_running", "true");
      localStorage.setItem("show_timer", "true");

      const endTime = Date.now() + 40 * 60 * 1000; // 40 minutes in milliseconds
      localStorage.setItem("countdown_end_time", endTime.toString());

      state.sessionConditions.is_session_finished = false;
      state.sessionConditions.is_timer_running = true;
      state.sessionConditions.show_timer = true;
    },
    finishSession: (state) => {
      localStorage.setItem("is_session_started", "false");
      localStorage.setItem("is_session_finished", "true");
      localStorage.setItem("is_timer_running", "false");

      state.sessionConditions.is_session_started = false;
      state.sessionConditions.is_session_finished = true;
      state.sessionConditions.is_timer_running = false;
    },
    postSaveSession: (state) => {
      localStorage.setItem("is_session_started", "false");
      localStorage.setItem("is_session_finished", "false");
      localStorage.setItem("is_timer_running", "false");
      localStorage.setItem("show_timer", "false");

      state.sessionConditions.is_session_started = false;
      state.sessionConditions.is_session_finished = false;
      state.sessionConditions.is_timer_running = false;
      state.sessionConditions.show_timer = false;
    },
    getSession: (state) => {
      const timer = localStorage.getItem("is_timer_running") === "true";
      const showTimer = localStorage.getItem("show_timer") === "true";
      const leftTime = localStorage.getItem("countdown_end_time");
      const start = localStorage.getItem("is_session_finished") === "true";
      const finish = localStorage.getItem("is_session_finished") === "true";

      /* let time: number = 0;

      if (leftTime) {
        const endTime = parseInt(leftTime, 10);
        const currentTime = Date.now();
        const timeDifference = endTime - currentTime;
        if (timeDifference > 0) {
          time = Math.floor(timeDifference / 1000); // Convert milliseconds to seconds
        } else {
          time = 0;
        }
      }

      const formatTime = (time: number) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      };
      */
      state.sessionConditions.is_timer_running = timer;
      state.sessionConditions.show_timer = showTimer;
      state.sessionConditions.is_session_started = start;
      state.sessionConditions.is_session_finished = finish;
      /* state.sessionConditions.left_time = time; */
    },
    setEssayContent: (state, action: PayloadAction<string>) => {
      state.tempEssayInfo.essay_text = action.payload;
    },
    setShowFeedbackDialog: (state, action: PayloadAction<boolean>) => {
      state.loadingStates.isDialogOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEssaySession.pending, (state, action) => {
        state.loadingStates.isQuestionLoading = true;
      })
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.tempEssayInfo.essay_question = action.payload;
        state.loadingStates.isQuestionLoading = false;
      })
      .addCase(createQuestion.rejected, (state, action) => {
        state.loadingStates.isQuestionLoading = false;
      })
      .addCase(saveEssayText.pending, (state, action) => {
        state.loadingStates.isSavingEssayText = true;
      })
      .addCase(saveEssayText.fulfilled, (state, action) => {
        state.loadingStates.isSavingEssayText = false;
      })
      .addCase(saveEssayText.rejected, (state, action) => {
        state.loadingStates.isSavingEssayText = false;
      })
      .addCase(createFeedback.pending, (state, action) => {
        state.loadingStates.isFeedbackLoading = true;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.tempEssayInfo.essay_feedback = action.payload;
        state.loadingStates.isFeedbackLoading = false;
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.loadingStates.isFeedbackLoading = false;
      })
      .addCase(saveAllEssayInfo.pending, (state, action) => {
        state.loadingStates.isSavingAllEssayInfo = true;
      })
      .addCase(saveAllEssayInfo.fulfilled, (state, action) => {
        state.loadingStates.isSavingAllEssayInfo = false;
      })
      .addCase(saveAllEssayInfo.rejected, (state, action) => {
        state.loadingStates.isSavingAllEssayInfo = false;
      })
      .addCase(deleteAllTempEssayInfo.pending, (state, action) => {
        state.loadingStates.isDeletingAllEssayInfo = true;
      })
      .addCase(deleteAllTempEssayInfo.fulfilled, (state, action) => {
        state.loadingStates.isDeletingAllEssayInfo = false;
      })
      .addCase(deleteAllTempEssayInfo.rejected, (state, action) => {
        state.loadingStates.isDeletingAllEssayInfo = false;
      })
      .addCase(getOperationCosts.fulfilled, (state, action) => {
        state.operationCosts = action.payload;
      })
      .addCase(getUserTempEssay.fulfilled, (state, action) => {
        state.tempEssayInfo = action.payload;
      })
      .addCase(getUserSavedEssay.pending, (state, action) => {
        state.loadingStates.isSavedSessionLoading = true;
      })
      .addCase(getUserSavedEssay.fulfilled, (state, action) => {
        state.savedEssayInfo = action.payload;
        state.loadingStates.isSavedSessionLoading = false;
      })
      .addCase(getUserSavedEssay.rejected, (state, action) => {
        state.loadingStates.isSavedSessionLoading = false;
      })
      .addCase(getEssayStore.pending, (state, action) => {
        state.loadingStates.isEssayStoreLoading = true;
      })
      .addCase(getEssayStore.fulfilled, (state, action) => {
        state.loadingStates.isEssayStoreLoading = false;
      })
      .addCase(getEssayStore.rejected, (state, action) => {
        state.loadingStates.isEssayStoreLoading = false;
      });
  },
});

export const {
  resetState,
  setEssayContent,
  setShowFeedbackDialog,
  createSession,
  startSession,
  finishSession,
  postSaveSession,
  getSession,
} = EssayStore.actions;
export default EssayStore.reducer;
