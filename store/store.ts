import { configureStore } from "@reduxjs/toolkit";
import tempEssayReducer from "./features/tempEssaySlice";

export const store = configureStore({
  reducer: {
    tempEssay: tempEssayReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
