"use client";

import { configureStore } from "@reduxjs/toolkit";
import EssayStoreReducer from "./features/essayStore";
import userInfoStoreReducer from "./features/userInfoStore";

export const store = configureStore({
  reducer: {
    essayStore: EssayStoreReducer,
    userInfoStore: userInfoStoreReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
