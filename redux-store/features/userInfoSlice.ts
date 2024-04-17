"use client";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabaseClient } from "@/utils/supabase/client";

const supabase = supabaseClient();

interface IUserInfo {
  email_address: string;
  full_name: string;
  avatar_url: string;
}

const initialState: IUserInfo = {
  email_address: "",
  full_name: "",
  avatar_url: "",
};

export const getUserInfo = createAsyncThunk(
  "userInfoSlice/getUserInfo",
  async () => {
    const id = (await supabase.auth.getUser()).data.user?.id;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("email_address, full_name, avatar_url")
        .eq("id", id)
        .single();

      if (!error) {
        const user: IUserInfo = data;
        return user;
      }
    } catch (error) {
      console.error(error);
    }

    return initialState;
  }
);

export const UserInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserInfo.fulfilled, (state, action) => {
      const { email_address, full_name, avatar_url } = action.payload;
      state.email_address = email_address;
      state.full_name = full_name;
      state.avatar_url = avatar_url;
    });
  },
});

export default UserInfoSlice.reducer;
