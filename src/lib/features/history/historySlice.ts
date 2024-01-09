import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "~/lib/store";
import { IBillState } from "../core/types";
import { IHistoryItem, IHistoryState } from "./types";

const createInitialState = () => ({
    records: []
});

const initialState: IHistoryState = createInitialState();

// Using Redux-thunk is the cleanest way to get the bill state from
// the other reducer.
export const addToHistory = createAsyncThunk<IBillState, void>(
    "history/addToHistory",
    async (_arg, thunkAPI) => {
      return (thunkAPI.getState() as RootState).bill;
    }
  );

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
    builder.addCase(addToHistory.fulfilled, (state, action: PayloadAction<IBillState>) => {
        state.records.push(action.payload);
    });
  }
});

// Selector

export const getHistoricalBill = (state: RootState, id: string): IHistoryItem | undefined => {
    return state.history.records.find(item => item.id === id);
};

export const getHistory = (state: RootState) => state.history;

// Exports

export const {
  removeFromHistory,
  clearAllHistory,
} = slice.actions;

export default slice.reducer;