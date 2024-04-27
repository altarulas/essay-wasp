"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { RootState } from "../store";
import dayjs from "dayjs";
import { toast } from "@/components/ui/use-toast";

const supabase = supabaseClient();

type subscriptionType = "MONTHLY" | "YEARLY" | null;

interface ISubscriptionInfo {
  subscription_type: subscriptionType;
  status: boolean;
}

interface IUser {
  email_address: string;
  full_name: string;
  avatar_url: string;
  credits: number | null;
  subscription_info: ISubscriptionInfo;
}

interface IUserInfo {
  user: IUser;
  isLoadingInfoStore: boolean;
  updateCreditsError: string | null;
}

const initialState: IUserInfo = {
  user: {
    email_address: "",
    full_name: "",
    avatar_url: "",
    credits: null,
    subscription_info: {
      subscription_type: null,
      status: false,
    },
  },
  isLoadingInfoStore: true,
  updateCreditsError: null,
};

export const getUserSubscription = createAsyncThunk(
  "userInfoStore/getUserSubscription",
  async (email_address: string) => {
    let subscriptionInfo: ISubscriptionInfo = {
      subscription_type: null,
      status: false,
    };

    const { data, error } = await supabase
      .from("users_subscription")
      .select("subscription_type, status")
      .eq("email_address", email_address)
      .single();

    if (!error) {
      subscriptionInfo.subscription_type = data.subscription_type;
      subscriptionInfo.status = data.status;
    }

    return subscriptionInfo;
  }
);

export const getUserCredits = createAsyncThunk(
  "userInfoStore/getUserCredits",

  async (email_address: string) => {
    try {
      const { data, error } = await supabase
        .from("users_credit")
        .select("credits")
        .eq("email_address", email_address)
        .single();

      if (!error) {
        const credit = data.credits;
        return credit;
      }
    } catch (error) {
      console.error(error);
    }

    return 0;
  }
);

export const updateUserCredit = createAsyncThunk(
  "userInfoStore/updateUserCredit",
  async (
    {
      email_address,
      spend_credits,
    }: {
      email_address: string;
      spend_credits: number;
    },
    { getState }
  ) => {
    const state = getState() as RootState;

    const current_credits = state.userInfoStore.user.credits;

    if (!current_credits) {
      toast({ title: "Something went wrong" });
      return null;
    }

    const new_credits = current_credits - spend_credits;
    const updated_at = dayjs().format("YYYY-MM-DD HH:mm:ss");

    try {
      const { data, error } = await supabase
        .from("users_credit")
        .update({ credits: new_credits, updated_at: updated_at })
        .eq("email_address", email_address)
        .single();

      if (!error) {
        return new_credits;
      } else {
        toast({ title: "Something went wrong" });
        return null;
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  }
);

export const getUserInfoStore = createAsyncThunk(
  "userInfoStore/getUserInfoStore",
  async (_, { dispatch }) => {
    let info: IUser = {
      email_address: "",
      full_name: "",
      avatar_url: "",
      credits: 0,
      subscription_info: {
        subscription_type: null,
        status: false,
      },
    };

    const id = (await supabase.auth.getUser()).data.user?.id;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("email_address, full_name, avatar_url")
        .eq("id", id)
        .single();

      if (!error) {
        const email_address: string = data.email_address;

        const credit = await dispatch(getUserCredits(email_address));
        const subscriptionInfo = await dispatch(
          getUserSubscription(email_address)
        );

        info = {
          email_address: data.email_address,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          credits: credit.payload,
          subscription_info: subscriptionInfo.payload as ISubscriptionInfo,
        };

        return info;
      }
    } catch (error) {
      console.error(error);
    }

    return info;
  }
);

export const UserInfoStore = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfoStore.pending, (state, action) => {
        state.isLoadingInfoStore = true;
      })
      .addCase(getUserInfoStore.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoadingInfoStore = false;
      })
      .addCase(getUserInfoStore.rejected, (state, action) => {
        state.isLoadingInfoStore = false;
      })
      .addCase(updateUserCredit.fulfilled, (state, action) => {
        state.user.credits = action.payload;
      });
  },
});

export default UserInfoStore.reducer;
