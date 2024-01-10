import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "~/lib/store";
import type { IBillState } from "../core";

// Using Redux-thunk is the cleanest way to get the bill state from
// the other reducer.
export const addToHistory = createAsyncThunk<IBillState, void, { state: RootState }>(
    "history/addToHistory",
    async (_arg, thunkAPI) => {
      return thunkAPI.getState().bill;
    }
  );
