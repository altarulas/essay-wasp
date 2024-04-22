"use client";

import { configureStore } from "@reduxjs/toolkit";
import EssayStoreReducer from "./features/essayStore";
import userInfoStoreReducer from "./features/userInfoStore";
import EssaySliceReducer from "./features/essaySlice";

export const store = configureStore({
  reducer: {
    essaySlice: EssaySliceReducer,
    essayStore: EssayStoreReducer,
    userInfoStore: userInfoStoreReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
