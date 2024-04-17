"use client";

import { configureStore } from "@reduxjs/toolkit";
import EssayReducer from "./features/essaySlice";
import userInfoReducer from "./features/userInfoSlice";

export const store = configureStore({
  reducer: {
    essay: EssayReducer,
    userInfo: userInfoReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
