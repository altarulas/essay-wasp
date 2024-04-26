"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";
import { RootState } from "../store";
import dayjs from "dayjs";

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
}

interface IUserInfo {
  user: IUser;
  credits: number;
  subscription_info: ISubscriptionInfo;
  isUserInfoLoading?: boolean;
}

const initialState: IUserInfo = {
  user: {
    email_address: "",
    full_name: "",
    avatar_url: "",
  },
  credits: 0,
  subscription_info: {
    subscription_type: null,
    status: false,
  },
  isUserInfoLoading: true,
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
    const current_credits = state.userInfoStore.credits;
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
      }
    } catch (error) {
      console.error(error);
    }

    return current_credits;
  }
);

export const getUserInfoStore = createAsyncThunk(
  "userInfoStore/getUserInfoStore",
  async (_, { dispatch, getState }) => {
    const id = (await supabase.auth.getUser()).data.user?.id;

    const { data, error } = await supabase
      .from("profiles")
      .select("email_address, full_name, avatar_url")
      .eq("id", id)
      .single();

    if (!error) {
      const email_address: string = data.email_address;

      const user: IUser = data;
      const credit = await dispatch(getUserCredits(email_address));
      const subscriptionInfo = await dispatch(
        getUserSubscription(email_address)
      );

      const info: IUserInfo = {
        user: {
          email_address: user.email_address,
          full_name: user.full_name,
          avatar_url: user.avatar_url,
        },
        credits: credit.payload,
        subscription_info: subscriptionInfo.payload as ISubscriptionInfo,
      };

      return info;
    }

    return initialState;
  }
);

export const UserInfoStore = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserInfoStore.pending, (state, action) => {
        state.isUserInfoLoading = true;
      })
      .addCase(getUserInfoStore.fulfilled, (state, action) => {
        const { user, credits, subscription_info } = action.payload;
        state.user = user;
        state.credits = credits;
        state.subscription_info = subscription_info;
        state.isUserInfoLoading = false;
      })
      .addCase(updateUserCredit.fulfilled, (state, action) => {
        state.credits = action.payload;
      });
  },
});

export default UserInfoStore.reducer;
