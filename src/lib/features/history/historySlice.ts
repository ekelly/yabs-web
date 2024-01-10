import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IHistoryState } from "./types";
import { addToHistory } from "./actions";

const createInitialState = () => ({
    records: []
});

const initialState: IHistoryState = createInitialState();

export const slice = createSlice({
  name: "history",
  initialState,
  reducers: {
    removeFromHistory: (state: IHistoryState, action: PayloadAction<string>) => {
        state.records = state.records.filter(item => item.id !== action.payload);
    },
    clearAllHistory: () => createInitialState(),
  },
  extraReducers: (builder) => {
    builder.addCase(addToHistory.fulfilled, (state, action) => {
        state.records.push(action.payload);
    });
  }
});

// Exports

export const {
  removeFromHistory,
  clearAllHistory,
} = slice.actions;

export default slice.reducer;